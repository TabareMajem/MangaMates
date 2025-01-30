export interface ServiceConfig {
  retryAttempts?: number;
  timeout?: number;
  cacheTime?: number;
}

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
  meta?: {
    cached?: boolean;
    duration?: number;
    retries?: number;
  };
}

export interface CacheConfig {
  key: string;
  ttl?: number;
  staleWhileRevalidate?: boolean;
}

export interface RateLimitConfig {
  maxRequests: number;
  window: number;
  identifier: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface AIConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  maxTokens?: number;
  temperature?: number;
  contextWindow?: number;
}
