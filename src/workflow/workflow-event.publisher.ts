import { Inject, Injectable } from '@nestjs/common';

import { type RedisPubSub } from 'src/redis/interfaces/redis-pubsub.interface';
import { REDIS_PUBSUB, WORKFLOW_CHANNEL } from './constants/redis.constants';
import { WorkflowEvent } from './interfaces/workflow-event.interface';

@Injectable()
export class WorkflowEventPublisher {
  constructor(@Inject(REDIS_PUBSUB) private readonly redis: RedisPubSub) {}

  async publish(event: WorkflowEvent): Promise<void> {
    await this.redis.publish(WORKFLOW_CHANNEL, JSON.stringify(event));
  }
}
