export interface RedisPubSub {
  publish(channel: string, message: string): Promise<number>;
}
