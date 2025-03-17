export type RiskLevel = 'low' | 'medium' | 'high' | 'crisis';
export type EmotionalState = 'neutral' | 'anxious' | 'depressed' | 'angry';
export type TherapeuticApproach = 'supportive' | 'cbt' | 'coaching' | 'crisis';

export interface MentalHealthCheck {
  riskLevel: RiskLevel;
  emotionalState: EmotionalState;
  recommendedApproach: TherapeuticApproach;
}

export interface CopingStrategy {
  name: string;
  description: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TherapeuticGoal {
  id: string;
  description: string;
  progress: number;
  strategies: CopingStrategy[];
  checkIns: Date[];
}
