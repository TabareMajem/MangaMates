import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600 // 1 hour default
): Promise<T> {
  const cached = await redis.get<T>(key);
  
  if (cached) {
    return cached;
  }

  const fresh = await fetchFn();
  await redis.set(key, fresh, { ex: ttl });
  
  return fresh;
}

export async function invalidateCache(key: string) {
  await redis.del(key);
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl = 3600
) {
  await redis.set(key, data, { ex: ttl });
}
