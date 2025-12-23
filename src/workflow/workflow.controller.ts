import { Controller, Param, Sse, UseGuards } from '@nestjs/common';
import { filter, map, merge, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLoggerService } from './workflow-logger.service';
import { AuthGuard } from '@nestjs/passport';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { WorkflowEventBusService } from 'src/jobs/workflow-event-bus.service';
@Controller('workflow')
@UseGuards(AuthGuard())
export class WorkflowController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly workflowLoggerService: WorkflowLoggerService,
    private readonly workflowEventBusService: WorkflowEventBusService,
  ) {}

  @Sse('status')
  sendActiveProcess(@GetUser() user: User) {
    return merge(
      this.workflowEventBusService.stream$.pipe(
        filter((e) => e.userId === user.id),
      ),
    ).pipe(
      map(
        (data) =>
          new MessageEvent('message', {
            data: JSON.stringify(data),
          }),
      ),
    );
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
