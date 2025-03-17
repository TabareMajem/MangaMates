import { anthropic } from '../anthropic-client';

export async function analyzeCognitivePatterns(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze the cognitive patterns in this journal entry. Focus on:
      1. Thought patterns (positive/negative)
      2. Decision-making processes
      3. Problem-solving approaches
      4. Self-reflection depth
      5. Growth mindset indicators

      Entry: ${content}
      
      Respond in JSON format:
      {
        "thought_patterns": {
          "positive": string[],
          "negative": string[]
        },
        "decision_making": string[],
        "problem_solving": string[],
        "reflection_depth": number,
        "growth_mindset": boolean
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
