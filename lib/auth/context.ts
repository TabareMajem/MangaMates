"use client";

import { createContext, useContext } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
});

export const useAuth = () => useContext(AuthContext);
