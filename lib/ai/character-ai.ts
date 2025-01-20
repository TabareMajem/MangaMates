import { Character } from '@/types/agent';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateResponse(
  character: Character,
  input: { type: 'task' | 'message'; content: string }
): Promise<string> {
  const prompt = createPrompt(character, input);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are ${character.name} from ${character.series}. 
                 Personality: ${character.personality.traits.join(', ')}
                 Background: ${character.personality.background}
                 Speaking Style: ${character.personality.speakingStyle}
                 Values: ${character.personality.values.join(', ')}`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  return completion.choices[0].message.content || "I'm not sure how to respond to that.";
}

function createPrompt(character: Character, input: { type: string; content: string }): string {
  switch (input.type) {
    case 'task':
      return `As ${character.name}, you need to perform this task: ${input.content}. 
              How would you respond to this task based on your personality and values?`;
    
    case 'message':
      return `Respond to this message as ${character.name}: ${input.content}`;
    
    default:
      return input.content;
  }
} 