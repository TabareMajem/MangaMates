export interface MessagingProvider {
  type: 'line' | 'kakao';
  enabled: boolean;
  config: {
    accessToken: string;
    channelId?: string; // LINE specific
    apiKey?: string; // Kakao specific
  };
}

export interface MessagingIntegration {
  id: string;
  userId: string;
  characterId: string;
  provider: MessagingProvider;
  webhookUrl: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface MessageEvent {
  provider: 'line' | 'kakao';
  userId: string;
  message: string;
  timestamp: Date;
}
