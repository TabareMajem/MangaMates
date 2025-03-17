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

export interface SocialMediaAnalysisResult {
  personality: {
    trait: string;
    score: number;
  }[];
  emotions: {
    date: string;
    joy: number;
    sadness: number;
    anxiety: number;
  }[];
  interests: string[];
  recommendations: {
    manga: string[];
    characters: string[];
  };
} 