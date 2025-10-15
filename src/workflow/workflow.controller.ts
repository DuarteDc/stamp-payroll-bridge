import { Controller, Param, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse(':tenantId')
  stream(@Param('userId') userId: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      const handler = (entry) => {
        observer.next({ data: entry });
      };
      this.eventEmitter.on(`workflow.${userId}`, handler);

      return () => this.eventEmitter.off(`workflow.${userId}`, handler);
    });
  }
}
