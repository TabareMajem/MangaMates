import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use mock client for development if env vars are missing
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            get: async () => ({ data: [], error: null })
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
