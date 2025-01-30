export interface SocialMediaAnalysis {
  personality: {
    trait: string;
    score: number;
    description: string;
  }[];
  emotions: {
    date: string;
    joy: number;
    sadness: number;
    anxiety: number;
    details: string;
  }[];
  interests: {
    category: string;
    topics: string[];
    confidence: number;
  }[];
  recommendations: {
    manga: {
      id: string;
      title: string;
      matchScore: number;
      reason: string;
    }[];
    characters: {
      id: string;
      name: string;
      compatibility: number;
      traits: string[];
    }[];
  };
}
