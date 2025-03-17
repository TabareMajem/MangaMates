export interface EmotionData {
  timestamp: string;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    trust: number;
  };
  source: 'assessment' | 'social' | 'journal';
  confidence: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  type: 'personality' | 'emotional' | 'mental';
  scores: Record<string, number>;
  timestamp: string;
}

export interface SocialSentiment {
  id: string;
  userId: string;
  platform: 'twitter' | 'instagram';
  sentiment: number;
  emotions: Record<string, number>;
  timestamp: string;
}

// For backward compatibility
export type EmotionState = EmotionData['emotions'];
