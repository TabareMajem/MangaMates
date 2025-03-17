import { anthropic } from '../anthropic-client';

export async function analyzePersonalGrowth(currentEntry: string, previousEntries: string[]) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze personal growth patterns between this entry and previous entries.
      
      Current: ${currentEntry}
      Previous: ${JSON.stringify(previousEntries)}
      
      Return a JSON response with:
      {
        "growth_areas": string[],
        "improvements": string[],
        "challenges": string[],
        "recommendations": string[],
        "growth_score": number
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
