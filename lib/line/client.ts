import type { OAuthTokens, UserProfile } from '@/types/auth';
import { ErrorHandler } from '../error/error-handler';

interface LineConfig {
  channelId: string;
  channelSecret: string;
  redirectUri: string;
}

interface LineTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export class LineClient {
  private readonly baseUrl = 'https://api.line.me';
  private readonly errorHandler: ErrorHandler;

  constructor(
    private config: LineConfig,
    errorHandler = new ErrorHandler()
  ) {
    this.errorHandler = errorHandler;
  }

  async getTokens(code: string): Promise<OAuthTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth2/v2.1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
          client_id: this.config.channelId,
          client_secret: this.config.channelSecret
        })
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const data = await response.json() as LineTokenResponse;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        scope: data.scope
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'line.getTokens',
        code
      });
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth2/v2.1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.channelId,
          client_secret: this.config.channelSecret
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json() as LineTokenResponse;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        scope: data.scope
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'line.refreshToken'
      });
      throw error;
    }
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Profile request failed: ${response.statusText}`);
      }

      const data = await response.json() as LineProfile;

      return {
        id: data.userId,
        name: data.displayName,
        picture: data.pictureUrl,
        provider: 'line'
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'line.getUserProfile'
      });
      throw error;
    }
  }

  async sendMessage(token: string, to: string, messages: any[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/bot/message/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to,
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`Message send failed: ${response.statusText}`);
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'line.sendMessage',
        to
      });
      throw error;
    }
  }
}

export const lineClient = new LineClient();
