import { bartleQuestions } from './questions/bartle-questions';
import type { Assessment } from './types';

export const bartleTest: Assessment = {
  id: 'bartle-test',
  title: 'Bartle Test',
  description: 'Discover your gamer personality type and find characters that match your play style.',
  traits: ['Achiever', 'Explorer', 'Socializer', 'Killer'],
  questions: bartleQuestions,
  calculateScore: (answers) => {
    const scores = {
      Achiever: 0,
      Explorer: 0,
      Socializer: 0,
      Killer: 0
    };

    Object.values(answers).forEach(value => {
      switch (value) {
        case 'achiever':
          scores.Achiever += 2;
          break;
        case 'explorer':
          scores.Explorer += 2;
          break;
        case 'socializer':
          scores.Socializer += 2;
          break;
        case 'killer':
          scores.Killer += 2;
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
