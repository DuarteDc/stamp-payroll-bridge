import { Controller, Param, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLoggerService } from './workflow-logger.service';
import { AuthGuard } from '@nestjs/passport';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
@Controller('workflow')
@UseGuards(AuthGuard())
export class WorkflowController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly workflowLoggerService: WorkflowLoggerService,
  ) {}

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

  @Sse('status')
  sendActiveProcess(@GetUser() user: User) {
    return new Observable((observer) => {
      this.workflowLoggerService
        .getWorkflowStatusSteam(user.id)
        .then(() => {
          observer.next(
            new MessageEvent('xd', {
              data: JSON.stringify({ cd: 'cfc' }),
            }),
          );
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
