import * as Sentry from '@sentry/nextjs';

export class RateLimiter {
  private requests: Map<string, number[]>;
  private readonly limit: number;
  private readonly window: number;

  constructor(limit = 100, window = 60000) {
    this.requests = new Map();
    this.limit = limit;
    this.window = window;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(time => now - time < this.window);
    
    if (validTimestamps.length >= this.limit) {
      Sentry.captureMessage(`Rate limit exceeded for key: ${key}`);
      return true;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return false;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
} 