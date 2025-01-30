import type { BaseQuestion } from '../types';

export const bigFiveQuestions: BaseQuestion[] = [
  {
    id: 'big-five-1',
    title: 'The Creative Challenge',
    scenario: 'A new art project requires innovative ideas. How do you approach it?',
    imagePrompt: {
      singlePanel: {
        prompt: "A vibrant art studio with various creative materials and experimental projects, manga style like Blue Period"
      }
    },
    options: [
      { text: "Try unconventional methods and experiment freely", value: "openness-high", trait: "Openness", score: 3 },
      { text: "Follow proven techniques with some personal touches", value: "openness-moderate", trait: "Openness", score: 2 },
      { text: "Stick to traditional methods that work well", value: "openness-low", trait: "Openness", score: 1 }
    ]
  },
  // Add remaining questions...
];
