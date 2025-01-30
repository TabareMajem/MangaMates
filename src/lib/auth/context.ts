import { createContext, useContext } from 'react';

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
