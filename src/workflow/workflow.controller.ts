import { Controller, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLoggerService } from './workflow-logger.service';

@Controller('workflow')
export class WorkflowController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly workflowLoggerService: WorkflowLoggerService,
  ) {}

  @Sse(':tenantId')
  stream(@Param('tenantId') tenantId: string): Observable<{ data: any }> {
    return new Observable(async (observer) => {
      const previousLogs =
        await this.workflowLoggerService.getLogsByTenant(tenantId);
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

      const handler = (payload: any) => observer.next({ data: payload });

      this.eventEmitter.on(`workflow.${tenantId}`, handler);

      return () => {
        console.log(`❌ desconectado workflow.${tenantId}`);
        this.eventEmitter.off(`workflow.${tenantId}`, handler);
      };
    });
  }
}
