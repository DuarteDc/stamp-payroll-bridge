import { Controller, Inject, Param, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLoggerService } from './workflow-logger.service';
import { AuthGuard } from '@nestjs/passport';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { REDIS_PUBSUB, WORKFLOW_CHANNEL } from './constants/redis.constants';
import Redis from 'ioredis';
import { WorkflowEvent } from './interfaces/workflow-event.interface';
@Controller('workflow')
@UseGuards(AuthGuard())
export class WorkflowController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly workflowLoggerService: WorkflowLoggerService,
    @Inject(REDIS_PUBSUB) private readonly redis: Redis,
  ) {}

  @Sse('status')
  sendActiveProcess(@GetUser() user: User) {
    return new Observable((observer) => {
      const subscriber = this.redis.duplicate();
      subscriber.subscribe(WORKFLOW_CHANNEL);
      subscriber.on('message', (_channel: string, message: string) => {
        const event = JSON.parse(message) as WorkflowEvent;
        if (event.tenant.id === user.tenant.id) {
          observer.next(new MessageEvent('message', { data: message }));
        }
      });

      return () => {
        subscriber.unsubscribe();
        subscriber.quit();
      };
    });
  }

  @Sse(':jobId')
  stream(
    @Param('jobId') jobId: string,
    @GetUser() user: User,
  ): Observable<MessageEvent> {
    return new Observable((observer) => {
      this.workflowLoggerService
        .getLogsByTenant(user.tenant.id, jobId)
        .then((previousLogs) => {
          for (const log of previousLogs) {
            observer.next(
              new MessageEvent('message', { data: JSON.stringify(log) }),
            );
          }

          const lastLog = previousLogs.at(-1);
          if (lastLog && ['success', 'error'].includes(lastLog.status)) {
            observer.complete();
            return;
          }

          const handler = (payload: any) => {
            observer.next(
              new MessageEvent('message', { data: JSON.stringify(payload) }),
            );
          };

          this.eventEmitter.on(`workflow.${jobId}`, handler);
          return () => {
            console.log(`❌ desconectado workflow.${jobId}`);
            this.eventEmitter.off(`workflow.${jobId}`, handler);
          };
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
