import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

interface CachedResponse {
  response: any;
  timestamp: number;
  metadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
  };
}

export class AIResponseCache {
  private redis: Redis;
  private readonly DEFAULT_TTL = 24 * 60 * 60; // 24 hours

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async getCachedResponse(prompt: string, options: any = {}): Promise<CachedResponse | null> {
    const key = this.generateCacheKey(prompt, options);
    const cached = await this.redis.get<CachedResponse>(key);
    
    if (cached && this.isResponseValid(cached)) {
      return cached;
    }

    return null;
  }

  async cacheResponse(prompt: string, response: any, metadata: CachedResponse['metadata'], options: any = {}): Promise<void> {
    const key = this.generateCacheKey(prompt, options);
    const cached: CachedResponse = {
      response,
      timestamp: Date.now(),
      metadata
    };

    await this.redis.set(key, cached, {
      ex: this.DEFAULT_TTL
    });
  }

  private generateCacheKey(prompt: string, options: any): string {
    const hash = createHash('md5')
      .update(prompt + JSON.stringify(options))
      .digest('hex');
    return `ai:response:${hash}`;
  }

  private isResponseValid(cached: CachedResponse): boolean {
    const age = Date.now() - cached.timestamp;
    return age < this.DEFAULT_TTL * 1000;
  }
}
