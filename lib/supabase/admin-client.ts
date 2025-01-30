import { createClient } from '@supabase/supabase-js';
import { env, validateEnv } from '../config/env';

// Validate environment variables
validateEnv();

// Create admin client with service role key for backend operations
export const supabaseAdmin = createClient(
  env.supabase.url!,
  env.supabase.serviceKey!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);
