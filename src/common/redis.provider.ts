// redis.provider.ts
import Redis from 'ioredis';
import { envs } from 'src/config';
import { REDIS_PUBSUB } from 'src/workflow/constants/redis.constants';
import { RedisPubSub } from 'src/workflow/interfaces/redis-pubsub.interface';

export const RedisProvider = {
  provide: REDIS_PUBSUB,
  useFactory: (): RedisPubSub => {
    const client = new Redis({
      host: envs.redisHost,
      port: envs.redisPort,
    });

    return {
      publish: (channel: string, message: string) =>
        client.publish(channel, message),
    };
  },
};
