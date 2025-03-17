import type { BaseQuestion } from '../types';

export const bartleQuestions: BaseQuestion[] = [
  {
    id: 'bartle-1',
    title: 'The Mysterious Dungeon',
    scenario: 'In the virtual world of Arcadia, you enter a mysterious dungeon rumored to hold rare treasures.',
    imagePrompt: {
      singlePanel: {
        prompt: "An anime-style scene of a hero standing at the entrance of a dark, ancient dungeon with mystical symbols."
      }
    },
    options: [
      { text: "Complete all challenges to earn achievements and trophies.", value: "achiever", trait: "Achiever", score: 3 },
      { text: "Explore every nook and cranny to discover hidden secrets.", value: "explorer", trait: "Explorer", score: 3 },
      { text: "Team up with other players to navigate the dungeon together.", value: "socializer", trait: "Socializer", score: 3 },
      { text: "Compete against others to reach the treasures first.", value: "killer", trait: "Killer", score: 3 }
    ]
  },
  {
    id: 'bartle-2',
    title: 'The Rare Artifact',
    scenario: 'You find a rare artifact that grants special abilities.',
    imagePrompt: {
      singlePanel: {
        prompt: "An anime-style image of a character holding a glowing, ornate artifact with intricate designs."
      }
    },
    options: [
      { text: "Utilize it to unlock new achievements and levels.", value: "achiever", trait: "Achiever", score: 3 },
      { text: "Study it to understand its origins and powers.", value: "explorer", trait: "Explorer", score: 3 },
      { text: "Share it with friends so everyone benefits.", value: "socializer", trait: "Socializer", score: 3 },
      { text: "Use it to gain an advantage over competitors.", value: "killer", trait: "Killer", score: 3 }
    ]
  }
  // Add remaining questions...
];
