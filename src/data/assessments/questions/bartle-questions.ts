export const bartleQuestions = [
  // Previous questions remain...
  {
    id: 'bartle-5',
    title: 'The Tournament Arena',
    scenario: 'A grand tournament is being held with various challenges and rewards. How do you participate?',
    imagePrompt: {
      singlePanel: {
        prompt: "A magnificent tournament arena with magical effects and excited crowd, manga style like My Hero Academia's sports festival"
      }
    },
    options: [
      {
        text: "Train intensively to win the championship",
        value: "achiever",
        trait: "Achiever",
        score: 2
      },
      {
        text: "Discover unique strategies and tournament secrets",
        value: "explorer",
        trait: "Explorer",
        score: 2
      },
      {
        text: "Form alliances with other participants",
        value: "socializer",
        trait: "Socializer",
        score: 2
      },
      {
        text: "Defeat the strongest competitors",
        value: "killer",
        trait: "Killer",
        score: 2
      }
    ]
  },
  // Add 10 more similar questions...
];
