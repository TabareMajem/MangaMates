export interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  isPremium?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
