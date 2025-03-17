import type { BaseQuestion } from '../types';

export const valuesQuestions: BaseQuestion[] = [
  {
    id: 'values-1',
    title: 'The Choice of Leadership',
    scenario: 'In the bustling city of Sakura Town, Hiro, the confident leader of the group, is organizing a community event. However, unexpected obstacles arise.',
    imagePrompt: {
      singlePanel: {
        prompt: "An anime-style scene of Hiro in Sakura Town, standing determinedly amidst a lively crowd, with a backdrop of festival decorations."
      }
    },
    options: [
      { text: "Take charge, delegate tasks, and motivate everyone to push through.", value: "leadership", trait: "Leadership", score: 3 },
      { text: "Encourage the team to brainstorm creative solutions together.", value: "collaboration", trait: "Collaboration", score: 2 },
      { text: "Work individually to solve the issues quietly behind the scenes.", value: "independence", trait: "Independence", score: 2 },
      { text: "Seek advice from a mentor to find the best course of action.", value: "wisdom", trait: "Wisdom", score: 2 }
    ]
  },
  {
    id: 'values-2',
    title: 'The Mysterious Puzzle',
    scenario: 'Aiko, the analytical thinker, stumbles upon an ancient puzzle that holds the key to a hidden treasure.',
    imagePrompt: {
      singlePanel: {
        prompt: "An anime-style image of Aiko kneeling before an ancient, intricate puzzle in a dimly lit temple, with glowing symbols."
      }
    },
    options: [
      { text: "Analyze the puzzle systematically and logically.", value: "strategic", trait: "Strategic Thinking", score: 3 },
      { text: "Use intuition and think outside the box for creative solutions.", value: "creativity", trait: "Creativity", score: 3 },
      { text: "Gather friends to solve it together.", value: "collaboration", trait: "Collaboration", score: 2 },
      { text: "Leave it for now and seek more information.", value: "prudence", trait: "Prudence", score: 2 }
    ]
  }
  // Add remaining questions...
];
