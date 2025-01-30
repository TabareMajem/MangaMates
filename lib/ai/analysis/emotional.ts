import { anthropic } from '../anthropic-client';

export async function analyzeEmotionalContent(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze the emotional content of this journal entry. Focus on:
      1. Primary emotions expressed
      2. Emotional intensity (1-10)
      3. Emotional patterns
      4. Potential emotional triggers
      5. Emotional growth opportunities

      Entry: ${content}
      
      Respond in JSON format:
      {
        "primary_emotions": string[],
        "intensity": number,
        "patterns": string[],
        "triggers": string[],
        "growth_areas": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
