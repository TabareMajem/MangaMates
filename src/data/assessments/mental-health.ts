import type { Assessment } from './index';

export const mentalHealthAssessment: Assessment = {
  id: 'mental-health',
  title: 'Mental Health Self-Reflection',
  description: 'Understand your emotional well-being and find characters who can support your journey.',
  traits: ['Emotional-Awareness', 'Coping-Skills', 'Social-Support', 'Self-Care', 'Resilience'],
  questions: [
    {
      id: 'mental-1',
      title: 'Recognizing Emotions',
      scenario: 'Sora notices you\'re feeling off today.',
      imagePrompt: {
        singlePanel: {
          prompt: "Create a gentle, supportive manga-style scene of Sora offering a caring smile, with soft lighting and a warm atmosphere. The art style should be similar to 'Your Lie in April' with emphasis on emotional expression."
        }
      },
      options: [
        {
          text: "Very comfortable; I can easily identify how I feel",
          value: "high-awareness",
          trait: "Emotional-Awareness",
          score: 3
        },
        {
          text: "Somewhat comfortable; sometimes I know how I feel",
          value: "moderate-awareness",
          trait: "Emotional-Awareness",
          score: 2
        },
        {
          text: "Not very comfortable; it's often hard to pinpoint my emotions",
          value: "low-awareness",
          trait: "Emotional-Awareness",
          score: 1
        },
        {
          text: "I prefer not to think about my emotions",
          value: "avoidance",
          trait: "Emotional-Awareness",
          score: 0
        }
      ]
    },
    // Add more questions from the provided list
  ],
  calculateScore: (answers) => {
    const scores = {
      'Emotional-Awareness': 0,
      'Coping-Skills': 0,
      'Social-Support': 0,
      'Self-Care': 0,
      'Resilience': 0
    };

    Object.values(answers).forEach(value => {
      const [trait, level] = value.split('-');
      const score = level === 'high' ? 3 : level === 'moderate' ? 2 : level === 'low' ? 1 : 0;
      scores[trait] += score;
    });

    // Convert to percentages (max score per trait is 12)
    return Object.fromEntries(
      Object.entries(scores).map(([key, value]) => [
        key,
        (value / 12) * 100
      ])
    );
  }
};
