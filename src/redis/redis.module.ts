import { Module } from '@nestjs/common';
import { RedisPubSubProvider } from './redis.provider';

@Module({
  providers: [RedisPubSubProvider],
  exports: [RedisPubSubProvider],
})
export class RedisModule {}
