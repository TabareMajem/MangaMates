export interface QuizResult {
  quizId: string;
  quizName: string;
  score: number;
  completedAt: string;
  results: {
    category: string;
    score: number;
  }[];
}

export interface PersonalityProfile {
  userId: string;
  name: string;
  occupation: string;
  username: string;
  assessmentScores: QuizResult[];
  socialMediaInsights?: SocialMediaAnalysis;
  journalInsights?: JournalAnalysis;
  combinedTraits: {
    primary: string[];
    secondary: string[];
    interests: string[];
  };
  valueAssessments: any[];
  strengthFinders: any[];
  bartleTests: any[];
  bigFivePersonalities: any[];
  mentalHealths: any[];
  topValues: string[];
  dominantStrengths: string[];
  personalityTraits: string[];
}

export interface SocialMediaAnalysis {
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
  platform?: 'Instagram' | 'Twitter' | 'TikTok';
  contentAnalysis?: {
    topics: string[];
    sentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    interests: string[];
    behaviorPatterns: string[];
  };
  personalityIndicators?: {
    extroversion: number;
    creativity: number;
    empathy: number;
  };
}

export interface JournalAnalysis {
  entries: number;
  topThemes: string[];
  emotionalTrends: {
    date: string;
    sentiment: number;
  }[];
  personalityInsights: {
    trait: string;
    score: number;
  }[];
}
