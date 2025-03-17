export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: BaseQuestion[];
  traits: string[];
  calculateScore: (answers: Record<string, string>) => Record<string, number>;
}

export interface BaseQuestion {
  id: string;
  title: string;
  scenario: string;
  imagePrompt: {
    multiPanel?: {
      prompt: string;
    };
    singlePanel: {
      prompt: string;
    };
  };
  options: QuestionOption[];
}

export interface QuestionOption {
  text: string;
  value: string;
  trait: string;
  score: number;
}
