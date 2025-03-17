export const serviceConfig = {
  ai: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY
  },
  auth: {
    line: {
      channelId: process.env.LINE_CHANNEL_ID,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    },
    kakao: {
      appKey: process.env.KAKAO_APP_KEY,
      clientSecret: process.env.KAKAO_CLIENT_SECRET
    }
  }
  // ... other services
};
