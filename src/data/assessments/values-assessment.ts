import { valuesQuestions } from './questions/values-questions';
import type { Assessment } from './types';

export const valuesAssessment: Assessment = {
  id: 'values-assessment',
  title: 'Values Assessment',
  description: 'Discover your core values and find characters that share your principles.',
  traits: ['Leadership', 'Collaboration', 'Independence', 'Wisdom', 'Creativity', 'Determination'],
  questions: valuesQuestions,
  calculateScore: (answers) => {
    const scores = {
      Leadership: 0,
      Collaboration: 0,
      Independence: 0,
      Wisdom: 0,
      Creativity: 0,
      Determination: 0
    };

    Object.values(answers).forEach(value => {
      switch (value) {
        case 'leadership':
          scores.Leadership += 2;
          break;
        case 'collaboration':
          scores.Collaboration += 2;
          break;
        case 'independence':
          scores.Independence += 2;
          break;
        case 'wisdom':
          scores.Wisdom += 2;
          break;
        case 'creativity':
          scores.Creativity += 2;
          break;
        case 'determination':
          scores.Determination += 2;
          break;
      }
    });

    // Convert to percentages
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      Object.entries(scores).map(([key, value]) => [
        key,
        (value / total) * 100
      ])
    );
  }
};
