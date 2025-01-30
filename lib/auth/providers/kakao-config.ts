interface KakaoOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export class KakaoOAuth {
  private config: KakaoOAuthConfig;

  constructor() {
    this.config = {
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/kakao/callback`,
      scope: [
        'profile_nickname',
        'profile_image',
        'account_email',
        'talk_message'
      ]
    };
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
      state
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      code
    });

    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to get Kakao access token');
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<{
    id: number;
    properties: {
      nickname: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
    kakao_account: {
      email?: string;
      email_needs_agreement?: boolean;
      is_email_valid?: boolean;
      is_email_verified?: boolean;
    };
  }> {
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get Kakao user info');
    }

    return response.json();
  }
}
