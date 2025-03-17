// OAuth Provider Types
export type OAuthProvider = 'line' | 'kakao';

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: string;
  provider: OAuthProvider;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error?: Error;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  line_id?: string;
  kakao_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  line: boolean;
  kakao: boolean;
}

// Auth Response Types
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: Error;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: User;
}

// Database Types
export interface OAuthTokenRecord {
  user_id: string;
  provider: OAuthProvider;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at: string;
}

export interface UserRecord {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  providers: OAuthProvider[];
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
