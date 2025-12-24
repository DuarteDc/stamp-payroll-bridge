import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import { WorkflowEvent } from './interfaces/workflow-event.interface';
import { REDIS_PUBSUB } from './constants/redis.constants';
import type { RedisPubSub } from 'src/redis/interfaces/redis-pubsub.interface';

@Injectable()
export class WorkflowEventSubscriber implements OnModuleInit {
  private readonly subject = new Subject<WorkflowEvent>();

  constructor(@Inject(REDIS_PUBSUB) private readonly redis: RedisPubSub) {}

  onModuleInit(): void {
    this.redis.subscribe(
      'workflow.events',
      (_channel: string, message: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const event: WorkflowEvent = JSON.parse(message);
        this.subject.next(event);
      },
    );
  }

  get stream$() {
    return this.subject.asObservable();
  }
}
