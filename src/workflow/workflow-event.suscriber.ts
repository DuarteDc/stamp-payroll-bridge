import { Inject, OnModuleInit } from '@nestjs/common';
import { WorkflowEvent } from 'src/jobs/interfaces/workflow-event.interface';

import Redis from 'ioredis';
export class WorkflowEventSuscriber implements OnModuleInit {
  private readonly subject = new Subject<WorkflowEvent>();

  constructor(@Inject('REDIS_PUBSUB') private readonly redis: typeof Redis) {}

  onModuleInit() {
    const sub = this.redis.duplicate();

    sub.subscribe('workflow.events');

    sub.on('message', (_, message) => {
      this.subject.next(JSON.parse(message));
    });
  }

  get stream$() {
    return this.subject.asObservable();
  }
}
