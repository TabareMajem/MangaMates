export const ANALYSIS_PROMPT = `Analyze this journal entry and provide:
1. Key themes and concepts
2. Emotional tone and sentiment
3. Personal insights and patterns
4. Gentle, encouraging feedback
5. Questions for deeper reflection

Format the response as JSON with these fields:
{
  "concepts": string[],
  "sentiment": number (-1 to 1),
  "analysis": {
    "themes": string[],
    "emotions": string[],
    "insights": string[],
    "feedback": string,
    "questions": string[]
  }
}`;

export const MEMORY_PROMPT = `Based on previous journal entries, identify:
1. Recurring themes
2. Progress patterns
3. Areas of growth
4. Potential challenges
5. Suggested focus areas

Consider the emotional journey and personal development over time.`;
