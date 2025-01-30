export class CBTSkills {
  identifyThoughtPatterns(content: string) {
    const patterns = {
      catastrophizing: /worst|never|always|terrible/gi,
      blackAndWhite: /everyone|nobody|everything|nothing/gi,
      overgeneralization: /every time|all the time|never works/gi,
      shouldStatements: /should|must|have to|ought to/gi
    };

    return Object.entries(patterns).reduce((acc, [pattern, regex]) => ({
      ...acc,
      [pattern]: (content.match(regex) || []).length > 0
    }), {});
  }

  generateCBTResponse(thoughtPatterns: Record<string, boolean>) {
    const responses = {
      catastrophizing: "I notice you're thinking about the worst possible outcome. Let's explore what evidence supports and challenges this thought.",
      blackAndWhite: "It seems like you're seeing this situation in black and white terms. Could there be some middle ground?",
      overgeneralization: "You're using words like 'always' and 'never'. Let's look at specific instances that might not fit this pattern.",
      shouldStatements: "Those 'should' statements can create a lot of pressure. What would happen if we replaced 'should' with 'could' or 'would like to'?"
    };

    return Object.entries(thoughtPatterns)
      .filter(([_, hasPattern]) => hasPattern)
      .map(([pattern]) => responses[pattern as keyof typeof responses])
      .join('\n\n');
  }

  suggestCopingStrategies(emotionalState: string): string[] {
    const strategies = {
      anxious: [
        "Try the 5-4-3-2-1 grounding exercise",
        "Practice deep breathing for 2 minutes",
        "Write down your worries and challenge each one"
      ],
      depressed: [
        "Do one small enjoyable activity",
        "Connect with someone supportive",
        "Break down tasks into smaller steps"
      ],
      angry: [
        "Take a brief time-out",
        "Practice progressive muscle relaxation",
        "Express your needs using 'I' statements"
      ]
    };

    return strategies[emotionalState as keyof typeof strategies] || [];
  }
}
