import { anthropic } from '../anthropic-client';

export async function analyzeGoals(content: string, previousGoals: string[]) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze goals and progress mentioned in this journal entry.
      Compare with previous goals: ${JSON.stringify(previousGoals)}
      
      Entry: ${content}
      
      Return a JSON response with:
      {
        "current_goals": string[],
        "progress_updates": {
          "goal": string,
          "status": "achieved" | "in_progress" | "stalled",
          "progress": number
        }[],
        "new_goals": string[],
        "recommendations": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
