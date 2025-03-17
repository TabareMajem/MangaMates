import { anthropic } from '../anthropic-client';

export async function analyzeThematicContent(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze the thematic content of this journal entry. Focus on:
      1. Main themes and topics
      2. Recurring concepts
      3. Personal values expressed
      4. Life areas discussed
      5. Goals and aspirations

      Entry: ${content}
      
      Respond in JSON format:
      {
        "themes": string[],
        "concepts": string[],
        "values": string[],
        "life_areas": string[],
        "goals": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
