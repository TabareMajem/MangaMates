declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_KEY: string;
    REDIS_URL: string;
    REDIS_TOKEN: string;
    LINE_CHANNEL_ID: string;
    LINE_CHANNEL_SECRET: string;
    KAKAO_APP_KEY: string;
    KAKAO_CLIENT_SECRET: string;
    SENTRY_DSN: string;
    JWT_SECRET: string;
    APP_NAME: string;
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_URL: string;
    LINE_CLIENT_ID: string;
    LINE_CLIENT_SECRET: string;
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
  }
}
