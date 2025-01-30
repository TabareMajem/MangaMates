import { create } from 'zustand';
import type { User, AuthState } from './types';
import { supabase } from '@/lib/supabase/client';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user: user as User | null, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    set({ user: data.user as User });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
