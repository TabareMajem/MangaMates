import { anthropic } from '../anthropic-client';

export async function analyzeSentiment(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze the emotional sentiment of this journal entry. Focus on:
      1. Primary emotions
      2. Emotional intensity (1-10)
      3. Emotional balance
      4. Underlying feelings
      
      Entry: ${content}
      
      Return a JSON response with:
      {
        "primary_emotion": string,
        "intensity": number,
        "secondary_emotions": string[],
        "balance_score": number,
        "sentiment_score": number
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
