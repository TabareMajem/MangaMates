import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { QueueMessage } from './message-queue.d';

export class MessageQueue {
  private redis: Redis;
  private logger: Logger;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
  }

  async enqueue(queue: string, message: QueueMessage, priority = 1): Promise<string> {
    const messageId = nanoid();
    const score = Date.now() + (priority * 1000);
    
    try {
      await this.redis
        .multi()
        .zadd(queue, { score, member: messageId })
        .hset(`message:${messageId}`, message)
        .exec();

      return messageId;
    } catch (error) {
      this.logger.error('Failed to enqueue message', error as Error);
      throw error;
    }
  }

  async dequeue(queue: string): Promise<QueueMessage | null> {
    try {
      const result = await this.redis
        .multi()
        .zpopmin(queue)
        .exec();

      if (!result?.[0] || !result[0][1]) {
        return null;
      }

      const messageId = result[0][1] as string;
      const message = await this.redis.hgetall(`message:${messageId}`);
      
      await this.redis.del(`message:${messageId}`);
      
      return message as QueueMessage;
    } catch (error) {
      this.logger.error('Failed to dequeue message', error as Error);
      throw error;
    }
  }
}
