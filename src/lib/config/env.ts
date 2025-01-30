const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  stripe: {
    publishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY'),
  },
  isDevelopment: import.meta.env.DEV,
} as const;
