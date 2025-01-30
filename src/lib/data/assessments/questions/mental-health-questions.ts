import type { BaseQuestion } from '../types';

export const mentalHealthQuestions: BaseQuestion[] = [
  {
    id: 'mental-health-1',
    title: 'Emotional Awareness',
    scenario: 'When faced with a challenging situation, how do you typically process your emotions?',
    imagePrompt: {
      singlePanel: {
        prompt: "An anime-style scene showing a character in a moment of reflection, with subtle visual metaphors for different emotions."
      }
    },
    options: [
      { text: "Take time to identify and understand each emotion", value: "awareness-high", trait: "Emotional-Awareness", score: 3 },
      { text: "Notice emotions but continue with tasks", value: "awareness-medium", trait: "Emotional-Awareness", score: 2 },
      { text: "Prefer not to dwell on emotional responses", value: "awareness-low", trait: "Emotional-Awareness", score: 1 }
    ]
  },
  // Add remaining questions...
];
