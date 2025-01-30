"use client";

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { mockUser } from '@/lib/mock-data';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      // Use mock data if Firebase is not configured
      setUser(mockUser as unknown as User);
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
