import { Redis } from '@upstash/redis';

// Check if we have the required environment variables
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a dummy Redis client if credentials are missing (for development)
const dummyRedis = {
  zremrangebyscore: async () => 0,
  zadd: async () => 0,
  zcount: async () => 0,
  incr: async () => 0,
  get: async () => null,
  set: async () => null,
};

// Create and export the Redis client
export const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : dummyRedis as unknown as Redis; 