import type { Assessment } from './index';

export const strengthsFinderAssessment: Assessment = {
  id: 'strengths-finder',
  title: 'Strengths Finder',
  description: 'Discover your core strengths and find characters who share them.',
  traits: [
    'Strategic-Thinking',
    'Leadership',
    'Empathy',
    'Innovation',
    'Resilience',
    'Communication'
  ],
  questions: [
    {
      id: 'strengths-1',
      title: 'The Tournament Challenge',
      scenario: 'A prestigious martial arts tournament is approaching. Different participants prepare in their own unique ways.',
      imagePrompt: {
        singlePanel: {
          prompt: "Create a manga-style scene showing multiple characters preparing for the tournament: Strategic-Thinking: Analyzing opponent data, Leadership: Guiding a team practice, Empathy: Supporting a nervous competitor, Innovation: Developing new techniques. Use an art style similar to 'Haikyuu!!' with dynamic poses and emotional depth."
        }
      },
      options: [
        {
          text: "Analyze past tournaments to develop winning strategies",
          value: "strategic-thinking-high",
          trait: "Strategic-Thinking",
          score: 3
        },
        {
          text: "Lead and motivate others in group training sessions",
          value: "leadership-high",
          trait: "Leadership",
          score: 3
        },
        {
          text: "Support and encourage nervous participants",
          value: "empathy-high",
          trait: "Empathy",
          score: 3
        },
        {
          text: "Create innovative training methods",
          value: "innovation-high",
          trait: "Innovation",
          score: 3
        }
      ]
    }
  ],
  calculateScore: (answers) => {
    const scores = {
      'Strategic-Thinking': 0,
      'Leadership': 0,
      'Empathy': 0,
      'Innovation': 0,
      'Resilience': 0,
      'Communication': 0
    };

    Object.values(answers).forEach(value => {
      const [trait, level] = value.split('-');
      const score = level === 'high' ? 3 : level === 'moderate' ? 2 : 1;
      scores[trait] += score;
    });

    // Convert to percentages (max score per trait is 15)
    return Object.fromEntries(
      Object.entries(scores).map(([key, value]) => [
        key,
        (value / 15) * 100
      ])
    );
  }
};
