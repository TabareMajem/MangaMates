import { anthropic } from '../anthropic-client';

export async function analyzeRelationships(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze relationship patterns and social interactions in this journal entry.
      Focus on:
      1. Key relationships mentioned
      2. Interaction patterns
      3. Communication styles
      4. Social dynamics
      
      Entry: ${content}
      
      Return a JSON response with:
      {
        "relationships": {
          "type": string,
          "quality": number,
          "patterns": string[]
        }[],
        "communication_style": string,
        "social_insights": string[],
        "suggestions": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
