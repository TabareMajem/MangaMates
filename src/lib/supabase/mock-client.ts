import { mockStats, mockEntries } from '../mock/supabase';

export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: mockStats, error: null }),
        get: async () => ({ data: mockEntries, error: null })
      })
    }),
    insert: async () => ({ error: null }),
    update: async () => ({ error: null })
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null })
  }
};
