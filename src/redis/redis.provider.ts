/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Provider } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';
import { envs } from 'src/config';
import { REDIS_PUBSUB } from 'src/workflow/constants/redis.constants';

export const RedisPubSubProvider: Provider = {
  provide: REDIS_PUBSUB,
  useFactory: (): RedisClient => {
    return new Redis({
      host: envs.redisHost,
      port: envs.redisPort,
    });
  },
};
