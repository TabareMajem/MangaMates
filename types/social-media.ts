export interface SocialMediaProfile {
  platform: 'instagram' | 'twitter';
  username: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface ContentAnalysis {
  topics: string[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  languages: string[];
  postFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  confidence: number;
}

export interface EmotionalPattern {
  emotion: string;
  intensity: number;
  frequency: number;
  triggers: string[];
}
