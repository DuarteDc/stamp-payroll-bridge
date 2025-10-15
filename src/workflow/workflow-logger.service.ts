import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WorkflowLoggerService {
  constructor(private eventEmitter: EventEmitter2) {}

  log(tenantId: string, step: string, status: string) {
    const entry = {
      tenantId,
      step,
      status,
      timestamp: new Date().toISOString(),
    };
    this.eventEmitter.emit(`workflow.${tenantId}`, entry);
    return entry;
  }
}
