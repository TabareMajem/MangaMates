import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../api/error-response';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyGenerator?: (req: NextApiRequest) => string;
}

export class RateLimiter {
  private redis: Redis;
  private logger: Logger;

  constructor(private config: RateLimitConfig) {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.config.keyGenerator = this.config.keyGenerator || this.defaultKeyGenerator;
  }

  middleware() {
    return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
      try {
        const key = `ratelimit:${this.config.keyGenerator!(req)}`;
        const current = await this.redis.incr(key);

        if (current === 1) {
          await this.redis.expire(key, Math.floor(this.config.windowMs / 1000));
        }

        res.setHeader('X-RateLimit-Limit', this.config.max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.max - current));

        if (current > this.config.max) {
          throw new ApiError(429, 'Too many requests');
        }

        next();
      } catch (error) {
        this.logger.error('Rate limiting failed', error as Error);
        
        if (error instanceof ApiError) {
          return res.status(error.statusCode).json({
            error: { message: error.message }
          });
        }

        return res.status(500).json({
          error: { message: 'Internal server error' }
        });
      }
    };
  }

  private defaultKeyGenerator(req: NextApiRequest): string {
    return req.headers['x-forwarded-for'] as string || 
           req.socket.remoteAddress || 
           'unknown';
  }

  async checkLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    return current <= limit;
  }
}
