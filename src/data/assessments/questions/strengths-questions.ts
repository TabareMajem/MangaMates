export const strengthsQuestions = [
  {
    id: 'strengths-1',
    title: 'Team Project',
    scenario: 'Your group needs to complete an important project. What role do you naturally take?',
    imagePrompt: {
      singlePanel: {
        prompt: "A diverse team working together in a modern office space with creative energy, manga style like Aggretsuko"
      }
    },
    options: [
      {
        text: "Take charge and coordinate everyone's efforts",
        value: "leadership-high",
        trait: "Leadership",
        score: 3
      },
      {
        text: "Analyze problems and develop strategic solutions",
        value: "strategic-thinking-high",
        trait: "Strategic-Thinking",
        score: 3
      },
      {
        text: "Support team members and maintain harmony",
        value: "empathy-high",
        trait: "Empathy",
        score: 3
      }
    ]
  },
  // Add 14 more questions covering different strengths...
];
