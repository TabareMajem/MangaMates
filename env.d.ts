declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    
    // Authentication
    NEXT_PUBLIC_AUTH_REDIRECT_URL: string;
    
    // AI Services
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    
    // LINE Messaging API
    LINE_CHANNEL_SECRET: string;
    LINE_CHANNEL_ACCESS_TOKEN: string;
    
    // LINE Login API
    NEXT_PUBLIC_LINE_CLIENT_ID: string;
    LINE_CLIENT_SECRET: string;
    
    // Social Media APIs
    NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: string;
    INSTAGRAM_CLIENT_SECRET: string;
    INSTAGRAM_ACCESS_TOKEN: string;
    
    // Redis for rate limiting and scheduling
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    
    // Application
    NEXT_PUBLIC_APP_URL: string;
  }
}
