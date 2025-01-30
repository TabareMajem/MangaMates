export class ResponseCache {
  private redis: Redis;
  
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(key: string, value: any, ttl: number) {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
