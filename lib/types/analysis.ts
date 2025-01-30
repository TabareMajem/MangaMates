export interface EmotionalTrend {
  timestamp: Date;
  joy: number;
  gratitude: number;
  energy: number;
  anxiety: number;
  sadness: number;
}

export interface CognitivePattern {
  category: string;
  positive: number;
  negative: number;
  timestamp: Date;
}

export interface ThemeAnalysis {
  id: string;
  text: string;
  score: number;
  weight: number;
  occurrences: number;
}

export interface ComparativeAnalysis {
  period1: {
    startDate: Date;
    endDate: Date;
    emotions: EmotionalTrend[];
    themes: ThemeAnalysis[];
  };
  period2: {
    startDate: Date;
    endDate: Date;
    emotions: EmotionalTrend[];
    themes: ThemeAnalysis[];
  };
  changes: {
    emotional: {
      improved: string[];
      declined: string[];
    };
    thematic: {
      new: string[];
      fading: string[];
    };
  };
}
