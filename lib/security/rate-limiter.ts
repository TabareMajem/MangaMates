import { Redis } from '@upstash/redis';

interface RateLimitConfig {
  redis: Redis;
  maxRequests?: number;
  window?: number;
}

export class RateLimiter {
  private redis: Redis;
  private maxRequests: number;
  private window: number;

  constructor(config: RateLimitConfig) {
    this.redis = config.redis;
    this.maxRequests = config.maxRequests ?? 100;
    this.window = config.window ?? 60;
  }

  async check(identifier: string) {
    const key = `rate_limit:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - this.window;

    // Clean old requests
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count recent requests
    const count = await this.redis.zcard(key);
    
    if (count >= this.maxRequests) {
      const oldestTimestamp = await this.redis.zrange(key, 0, 0);
      const reset = oldestTimestamp ? 
        parseInt(oldestTimestamp.toString()) + this.window : 
        now + this.window;
      
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      };
    }

    // Add new request
    await this.redis.zadd(key, { score: now, member: now.toString() });
    await this.redis.expire(key, this.window);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - count - 1,
      reset: now + this.window,
    };
  }
}

// Create with default Redis instance
export const rateLimit = new RateLimiter({ 
  redis: Redis.fromEnv() 
});
