import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number; // in milliseconds
  maxDelay: number; // in milliseconds
  backoffFactor: number;
}

interface WebhookEvent {
  id: string;
  type: string;
  payload: any;
  attempts: number;
  nextRetry: number;
  error?: string;
}

export class WebhookRetryManager {
  private redis: Redis;
  private logger: Logger;
  private config: RetryConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.config = {
      maxAttempts: 5,
      initialDelay: 1000, // 1 second
      maxDelay: 1800000, // 30 minutes
      backoffFactor: 2
    };
  }

  async scheduleRetry(eventId: string, type: string, payload: any, error: Error): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      
      if (!event) {
        // First failure
        await this.createRetryEvent(eventId, type, payload, error);
        return;
      }

      if (event.attempts >= this.config.maxAttempts) {
        await this.handleMaxRetriesExceeded(event);
        return;
      }

      await this.updateRetryEvent(event, error);
    } catch (error) {
      this.logger.error('Failed to schedule webhook retry', error as Error);
    }
  }

  private async createRetryEvent(eventId: string, type: string, payload: any, error: Error): Promise<void> {
    const event: WebhookEvent = {
      id: eventId,
      type,
      payload,
      attempts: 1,
      nextRetry: Date.now() + this.config.initialDelay,
      error: error.message
    };

    await this.redis.set(
      `webhook:${eventId}`,
      JSON.stringify(event),
      { ex: 86400 } // 24 hours TTL
    );

    await this.redis.zadd(
      'webhook_retry_queue',
      event.nextRetry,
      eventId
    );
  }

  private async updateRetryEvent(event: WebhookEvent, error: Error): Promise<void> {
    const delay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffFactor, event.attempts),
      this.config.maxDelay
    );

    const updatedEvent: WebhookEvent = {
      ...event,
      attempts: event.attempts + 1,
      nextRetry: Date.now() + delay,
      error: error.message
    };

    await this.redis.set(
      `webhook:${event.id}`,
      JSON.stringify(updatedEvent),
      { ex: 86400 }
    );

    await this.redis.zadd(
      'webhook_retry_queue',
      updatedEvent.nextRetry,
      event.id
    );
  }

  private async handleMaxRetriesExceeded(event: WebhookEvent): Promise<void> {
    // Move to dead letter queue
    await this.redis.lpush('webhook_dlq', JSON.stringify({
      ...event,
      failedAt: Date.now()
    }));

    // Cleanup retry queue
    await Promise.all([
      this.redis.del(`webhook:${event.id}`),
      this.redis.zrem('webhook_retry_queue', event.id)
    ]);

    this.logger.error('Webhook max retries exceeded', new Error('Max retries exceeded'), {
      eventId: event.id,
      type: event.type,
      attempts: event.attempts
    });
  }

  private async getEvent(eventId: string): Promise<WebhookEvent | null> {
    const data = await this.redis.get<string>(`webhook:${eventId}`);
    return data ? JSON.parse(data) : null;
  }

  async processRetryQueue(): Promise<void> {
    try {
      const now = Date.now();
      const events = await this.redis.zrangebyscore(
        'webhook_retry_queue',
        0,
        now
      );

      for (const eventId of events) {
        const event = await this.getEvent(eventId);
        if (!event) continue;

        try {
          await this.processWebhook(event);
          await this.cleanupSuccessfulEvent(eventId);
        } catch (error) {
          await this.scheduleRetry(
            eventId,
            event.type,
            event.payload,
            error as Error
          );
        }
      }
    } catch (error) {
      this.logger.error('Failed to process retry queue', error as Error);
    }
  }

  private async processWebhook(event: WebhookEvent): Promise<void> {
    // Implement webhook processing logic based on event type
    switch (event.type) {
      case 'line_message':
        // Process LINE message webhook
        break;
      case 'kakao_message':
        // Process Kakao message webhook
        break;
      default:
        throw new Error(`Unknown webhook type: ${event.type}`);
    }
  }

  private async cleanupSuccessfulEvent(eventId: string): Promise<void> {
    await Promise.all([
      this.redis.del(`webhook:${eventId}`),
      this.redis.zrem('webhook_retry_queue', eventId)
    ]);
  }
}
