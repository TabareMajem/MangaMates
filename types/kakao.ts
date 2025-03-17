export interface KakaoConfig {
  appKey: string;
  clientSecret: string;
  redirectUri: string;
}

export interface KakaoProfile {
  id: string;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile_needs_agreement?: boolean;
    profile?: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email_needs_agreement?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: string;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    gender_needs_agreement?: boolean;
    gender?: 'female' | 'male';
  };
}

export interface KakaoTokens {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  refresh_token_expires_in: number;
}

export interface KakaoMessage {
  object_type: 'text' | 'feed' | 'list' | 'location' | 'commerce';
  text?: string;
  link?: {
    web_url?: string;
    mobile_web_url?: string;
    android_execution_params?: string;
    ios_execution_params?: string;
  };
  button_title?: string;
}
