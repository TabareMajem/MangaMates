import type { KakaoConfig, KakaoMessage, KakaoProfile, KakaoTokens } from '@/types/kakao';
import { ResponseCache } from '../cache/response-cache';
import { ErrorHandler } from '../error/error-handler';
import { RateLimiter } from '../middleware/rate-limiter';

export class KakaoClient {
  private rateLimiter: RateLimiter;
  private cache: ResponseCache;
  private errorHandler: ErrorHandler;
  private readonly baseUrl = 'https://kapi.kakao.com/v2';
  private readonly authUrl = 'https://kauth.kakao.com/oauth';

  constructor(
    private config: KakaoConfig,
    rateLimiter = new RateLimiter({ windowMs: 60000, max: 30 }),
    cache = new ResponseCache(),
    errorHandler = new ErrorHandler()
  ) {
    this.rateLimiter = rateLimiter;
    this.cache = cache;
    this.errorHandler = errorHandler;
  }

  async initialize(channelId: string) {
    try {
      const rateKey = `kakao:init:${channelId}`;
      if (!await this.rateLimiter.checkLimit(rateKey, 5, 60)) {
        throw new Error('Rate limit exceeded for Kakao initialization');
      }

      await this.validateChannel(channelId);
    } catch (error) {
      if (error instanceof Error) {
        await this.errorHandler.handleError(error, {
          context: 'KakaoClient.initialize',
          channelId
        });
      }
      throw error;
    }
  }

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.appKey,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      state
    });

    return `${this.authUrl}/authorize?${params.toString()}`;
  }

  async getTokens(code: string): Promise<KakaoTokens> {
    try {
      const rateKey = 'kakao:token:exchange';
      if (!await this.rateLimiter.checkLimit(rateKey, 10, 60)) {
        throw new Error('Rate limit exceeded for token exchange');
      }

      const response = await fetch(`${this.authUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.config.appKey,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          code
        })
      });

      if (!response.ok) {
        throw new Error(`Kakao token exchange failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        await this.errorHandler.handleError(error, {
          context: 'KakaoClient.getTokens',
          code: code.substring(0, 6) + '...' // Log only part of the code for security
        });
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<KakaoTokens> {
    try {
      const rateKey = `kakao:token:refresh:${refreshToken.substring(0, 6)}`;
      if (!await this.rateLimiter.checkLimit(rateKey, 2, 60)) {
        throw new Error('Rate limit exceeded for token refresh');
      }

      const response = await fetch(`${this.authUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.appKey,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error(`Kakao token refresh failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        await this.errorHandler.handleError(error, {
          context: 'KakaoClient.refreshToken'
        });
      }
      throw error;
    }
  }

  async getUserProfile(accessToken: string): Promise<KakaoProfile> {
    try {
      const cacheKey = `kakao:profile:${accessToken.substring(0, 6)}`;
      const cached = await this.cache.get<KakaoProfile>(cacheKey);
      if (cached) return cached;

      const rateKey = `kakao:profile:${accessToken.substring(0, 6)}`;
      if (!await this.rateLimiter.checkLimit(rateKey, 5, 60)) {
        throw new Error('Rate limit exceeded for profile fetch');
      }

      const response = await fetch(`${this.baseUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Kakao profile: ${response.statusText}`);
      }

      const profile = await response.json();
      await this.cache.set(cacheKey, profile, 300); // Cache for 5 minutes
      return profile;
    } catch (error) {
      if (error instanceof Error) {
        await this.errorHandler.handleError(error, {
          context: 'KakaoClient.getUserProfile'
        });
      }
      throw error;
    }
  }

  async sendMessage(channelId: string, message: KakaoMessage) {
    try {
      const rateKey = `kakao:message:${channelId}`;
      if (!await this.rateLimiter.checkLimit(rateKey, 10, 60)) {
        throw new Error('Rate limit exceeded for sending messages');
      }

      const accessToken = await this.getAccessToken(channelId);
      const response = await fetch(`${this.baseUrl}/api/talk/memo/default/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          template_object: JSON.stringify(message)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send Kakao message: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        await this.errorHandler.handleError(error, {
          context: 'KakaoClient.sendMessage',
          channelId
        });
      }
      throw error;
    }
  }

  private async validateChannel(channelId: string) {
    const accessToken = await this.getAccessToken(channelId);
    const response = await fetch(`${this.baseUrl}/api/talk/channels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Invalid Kakao channel: ${response.statusText}`);
    }

    return response.json();
  }

  private async getAccessToken(channelId: string): Promise<string> {
    const cacheKey = `kakao:token:${channelId}`;
    const cached = await this.cache.get<string>(cacheKey);
    if (cached) return cached;

    // Here you would implement your token retrieval/refresh logic
    // This is just a placeholder - you need to implement the actual logic
    throw new Error('Token retrieval not implemented');
  }
}

// Create a singleton instance
const kakaoClientInstance = new KakaoClient({
  appKey: process.env.KAKAO_APP_KEY!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/kakao/callback`
});

// Export both the class and instance
export { kakaoClientInstance as kakaoClient };
