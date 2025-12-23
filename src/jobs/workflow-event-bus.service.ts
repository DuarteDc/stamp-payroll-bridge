import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { WorkflowEvent } from './interfaces/workflow-event.interface';

@Injectable()
export class WorkflowEventBusService {
  private subject = new Subject<WorkflowEvent>();

  emit(event: WorkflowEvent) {
    this.subject.next(event);
  }

  get stream$() {
    return this.subject.asObservable();
  }
}
