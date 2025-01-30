export const valuesQuestions = [
  // Previous questions remain...
  {
    id: 'values-3',
    title: 'The Moral Dilemma',
    scenario: 'You discover information that could help your team win but using it might be considered unfair. What do you do?',
    imagePrompt: {
      singlePanel: {
        prompt: "A character contemplating a decision with light and shadow symbolism, manga style like Death Note"
      }
    },
    options: [
      {
        text: "Lead by example and choose the ethical path",
        value: "leadership",
        trait: "Leadership",
        score: 2
      },
      {
        text: "Discuss the situation with the team collectively",
        value: "collaboration",
        trait: "Collaboration",
        score: 2
      },
      {
        text: "Make your own decision based on personal principles",
        value: "independence",
        trait: "Independence",
        score: 2
      },
      {
        text: "Seek guidance from experienced mentors",
        value: "wisdom",
        trait: "Wisdom",
        score: 2
      }
    ]
  },
  // Add 12 more questions...
];
