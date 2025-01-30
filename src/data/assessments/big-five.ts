import type { Assessment } from './types';

export const bigFiveAssessment: Assessment = {
  id: 'big-five',
  title: 'Big Five Personality',
  description: 'Understand your personality through the scientific Big Five model.',
  traits: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
  questions: [
    {
      id: 'big-five-1',
      title: 'The Uncharted Path',
      scenario: 'You discover a hidden path in a mysterious forest. Various signs suggest it leads to something extraordinary.',
      imagePrompt: {
        singlePanel: {
          prompt: "Create a manga-style scene of a mysterious forest path with glowing elements and subtle signs of wonder, using a style similar to 'Mushishi'"
        }
      },
      options: [
        {
          text: "Eagerly explore the path, excited about potential discoveries",
          value: "openness-high",
          trait: "Openness",
          score: 3
        },
        {
          text: "Carefully plan and prepare before proceeding",
          value: "conscientiousness-high",
          trait: "Conscientiousness",
          score: 3
        },
        {
          text: "Seek companions to share the adventure",
          value: "extraversion-high",
          trait: "Extraversion",
          score: 3
        },
        {
          text: "Consider the risks and potential dangers first",
          value: "neuroticism-high",
          trait: "Neuroticism",
          score: 3
        }
      ]
    }
    // Add more questions as needed
  ],
  calculateScore: (answers) => {
    const scores = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0
    };

    Object.values(answers).forEach(value => {
      const [trait, level] = value.split('-');
      const score = level === 'high' ? 3 : level === 'moderate' ? 2 : 1;
      const traitKey = trait.charAt(0).toUpperCase() + trait.slice(1);
      scores[traitKey] += score;
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
