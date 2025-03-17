import { sendEmail } from '@/lib/email/mailer';
import * as Sentry from '@sentry/nextjs';
import { Redis } from '@upstash/redis';

export class AlertSystem {
  private redis: Redis;
  
  constructor() {
    this.redis = Redis.fromEnv();
  }

  async trackError(error: Error, context: Record<string, any> = {}) {
    const errorKey = `errors:${error.name}:${Date.now()}`;
    const errorCount = await this.getErrorCount(error.name);

    // Store error details
    await this.redis.set(errorKey, {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });

    // Check thresholds and trigger alerts
    if (errorCount > 10) {
      await this.triggerHighErrorAlert(error.name, errorCount);
    }

    // Track in Sentry
    Sentry.captureException(error, { extra: context });
  }

  private async getErrorCount(errorType: string): Promise<number> {
    const minute = 60 * 1000;
    const now = Date.now();
    const keys = await this.redis.keys(`errors:${errorType}:${now - minute}*`);
    return keys.length;
  }

  private async triggerHighErrorAlert(errorType: string, count: number) {
    await sendEmail({
      to: process.env.ALERT_EMAIL!,
      template: 'high-error-alert',
      data: {
        errorType,
        count,
        timestamp: new Date().toISOString()
      }
    });
  }
}
