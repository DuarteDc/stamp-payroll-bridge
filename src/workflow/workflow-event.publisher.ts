import { Inject, Injectable } from '@nestjs/common';

import Redis from 'ioredis';
import { WorkflowEvent } from '../jobs/interfaces/workflow-event.interface';
import { REDIS_PUBSUB } from './constants/redis.constants';
@Injectable()
export class WorkflowEventPublisher {
  constructor(@Inject(REDIS_PUBSUB) private readonly redis: Redis) {}

  async publish(event: WorkflowEvent): Promise<void> {
    await this.redis.publish('workflow.events', JSON.stringify(event));
  }
}
