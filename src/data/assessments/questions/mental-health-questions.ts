export const mentalHealthQuestions = [
  {
    id: 'mental-health-1',
    title: 'Emotional Awareness',
    scenario: 'You notice changes in your mood throughout the day. How do you handle these emotions?',
    imagePrompt: {
      singlePanel: {
        prompt: "A serene scene showing a character reflecting by a window with subtle visual metaphors for different emotions, manga style like A Silent Voice"
      }
    },
    options: [
      {
        text: "Acknowledge and process each emotion mindfully",
        value: "awareness-high",
        trait: "Emotional-Awareness",
        score: 3
      },
      {
        text: "Notice the changes but continue with your day",
        value: "awareness-moderate",
        trait: "Emotional-Awareness",
        score: 2
      },
      {
        text: "Try to maintain a constant mood regardless",
        value: "awareness-low",
        trait: "Emotional-Awareness",
        score: 1
      }
    ]
  },
  // Add 14 more questions covering different mental health aspects...
];
