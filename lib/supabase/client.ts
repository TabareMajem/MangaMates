import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { mockSupabase } from './mock-client';

// Use mock client if environment variables are not available
export const supabase = env.supabase.url && env.supabase.anonKey
  ? createClient(env.supabase.url, env.supabase.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : mockSupabase;
