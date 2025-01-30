import type { OAuthProvider, OAuthTokens, UserProfile } from '@/types/auth';
import { ErrorHandler } from '../error/error-handler';
import { supabase } from '../supabase';

export class OAuthManager {
  constructor(
    private provider: OAuthProvider,
    private clientId: string,
    private clientSecret: string,
    private redirectUri: string,
    private errorHandler = new ErrorHandler()
  ) {}

  getAuthorizationUrl(state: string): string {
    const baseUrls = {
      line: 'https://access.line.me/oauth2/v2.1/authorize',
      kakao: 'https://kauth.kakao.com/oauth/authorize'
    };

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: this.getScopes()
    });

    return `${baseUrls[this.provider]}?${params.toString()}`;
  }

  async getTokens(code: string): Promise<OAuthTokens> {
    const tokenUrls = {
      line: 'https://api.line.me/oauth2/v2.1/token',
      kakao: 'https://kauth.kakao.com/oauth/token'
    };

    try {
      const response = await fetch(tokenUrls[this.provider], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        scope: data.scope
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'oauth.getTokens',
        provider: this.provider,
        code
      });
      throw error;
    }
  }

  async refreshTokens(refreshToken: string): Promise<OAuthTokens> {
    const refreshUrls = {
      line: 'https://api.line.me/oauth2/v2.1/token',
      kakao: 'https://kauth.kakao.com/oauth/token'
    };

    try {
      const response = await fetch(refreshUrls[this.provider], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken, // Some providers don't return new refresh token
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        scope: data.scope
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'oauth.refreshTokens',
        provider: this.provider
      });
      throw error;
    }
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const profileUrls = {
      line: 'https://api.line.me/v2/profile',
      kakao: 'https://kapi.kakao.com/v2/user/me'
    };

    try {
      const response = await fetch(profileUrls[this.provider], {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Profile request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformProfile(data);
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'oauth.getUserProfile',
        provider: this.provider
      });
      throw error;
    }
  }

  private getScopes(): string {
    const scopes = {
      line: 'profile openid email',
      kakao: 'profile_nickname profile_image account_email'
    };
    return scopes[this.provider];
  }

  private transformProfile(data: any): UserProfile {
    switch (this.provider) {
      case 'line':
        return {
          id: data.userId,
          name: data.displayName,
          email: data.email,
          picture: data.pictureUrl,
          provider: 'line'
        };
      case 'kakao':
        return {
          id: data.id.toString(),
          name: data.properties.nickname,
          email: data.kakao_account?.email,
          picture: data.properties.profile_image,
          provider: 'kakao'
        };
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  async storeTokens(userId: string, tokens: OAuthTokens): Promise<void> {
    const { error } = await supabase
      .from('oauth_tokens')
      .upsert({
        user_id: userId,
        provider: this.provider,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: new Date(Date.now() + tokens.expiresIn * 1000).toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }
}
