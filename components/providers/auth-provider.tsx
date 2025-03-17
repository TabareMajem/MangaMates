"use client";

import { useState } from 'react';
import { AuthContext } from '@/lib/auth/context';
import { mockUser } from '@/lib/auth/mock';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState(mockUser);
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth } from '@/lib/auth/context';
