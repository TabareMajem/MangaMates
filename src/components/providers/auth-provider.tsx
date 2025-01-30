"use client";

import { useState } from 'react';
import { AuthContext } from '@/lib/auth/context';

// Mock user for development
const mockUser = {
  id: 'mock-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  isPremium: false
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState(mockUser);
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
