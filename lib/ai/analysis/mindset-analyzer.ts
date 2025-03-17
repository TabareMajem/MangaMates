import { anthropic } from '../anthropic-client';

export async function analyzeMindset(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze the mindset and thought patterns in this journal entry.
      Focus on:
      1. Growth vs fixed mindset indicators
      2. Problem-solving approaches
      3. Decision-making patterns
      4. Self-reflection depth
      
      Entry: ${content}
      
      Return a JSON response with:
      {
        "mindset_type": "growth" | "fixed" | "mixed",
        "thought_patterns": {
          "positive": string[],
          "limiting": string[]
        },
        "reflection_depth": number,
        "recommendations": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
