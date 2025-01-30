import { OAuth2Client } from 'google-auth-library';

interface KakaoConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class KakaoService {
  private config: KakaoConfig;
  private oauth2Client: OAuth2Client;

  constructor() {
    this.config = {
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      redirectUri: process.env.KAKAO_REDIRECT_URI!
    };

    this.oauth2Client = new OAuth2Client(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );
  }

  async getAuthUrl(): string {
    return 'https://kauth.kakao.com/oauth/authorize?' + new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'profile_nickname profile_image account_email'
    }).toString();
  }

  async handleCallback(code: string) {
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        code
      }).toString()
    });

    const tokens = await tokenResponse.json();
    return this.getUserInfo(tokens.access_token);
  }

  private async getUserInfo(accessToken: string) {
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return userResponse.json();
  }
}
