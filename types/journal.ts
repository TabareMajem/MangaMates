export interface Analysis {
  emotions: Record<string, number>;
  themes: string[];
  insights: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  sentimentAnalysis?: {
    sentiment: number;
    emotions: {
      joy: number;
      sadness: number;
      anger: number;
      fear: number;
      surprise: number;
      trust: number;
    };
  };
  themes?: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalAnalysis {
  sentiment: number;
  emotions: Record<string, number>;
  themes: string[];
  keywords: string[];
}
