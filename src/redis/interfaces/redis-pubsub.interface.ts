export interface RedisPubSub {
  publish(channel: string, message: string): Promise<number>;
  subscribe(
    channel: string,
    handler: (channel: string, message: string) => void,
  ): void;
}
