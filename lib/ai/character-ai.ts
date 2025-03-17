import { Character } from '@/types/agent';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateResponse(
  character: Character,
  prompt: { type: string; content: string }
): Promise<string> {
  try {
    // Create a system prompt based on character
    const systemPrompt = `You are ${character.name}, a character from ${character.series || 'a fictional world'}. 
    ${character.personality || ''}
    ${character.description || ''}
    
    Respond to all messages in character, using the appropriate tone, vocabulary, and mannerisms.`;
    
    // Use OpenAI by default
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.content }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    return completion.choices[0].message.content || fallbackResponse(character, prompt);
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Try Anthropic as fallback if available
    try {
      if (process.env.ANTHROPIC_API_KEY) {
        const message = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          system: `You are ${character.name}, a character from ${character.series || 'a fictional world'}. 
          ${character.personality || ''}
          ${character.description || ''}
          
          Respond to all messages in character, using the appropriate tone, vocabulary, and mannerisms.`,
          messages: [
            { role: "user", content: prompt.content }
          ],
          max_tokens: 300
        });
        
        return message.content[0].text || fallbackResponse(character, prompt);
      }
    } catch (secondError) {
      console.error("Fallback AI also failed:", secondError);
    }
    
    // Return fallback response if both fail
    return fallbackResponse(character, prompt);
  }
}

// Fallback responses if AI services fail
function fallbackResponse(character: Character, prompt: { type: string; content: string }): string {
  const responses = {
    message: [
      `Hi there! I'm ${character.name}. ${character.personality || ''}`,
      `Hello! ${character.name} here. How are you doing today?`,
      `Hey! It's ${character.name}. ${character.description || ''}`
    ],
    task: [
      `I'm ${character.name} and I'm here to help with your task!`,
      `${character.name} reporting for duty! Let's get this done.`,
      `Task accepted! This is ${character.name}, ready to assist.`
    ]
  };
  
  const responseType = prompt.type as keyof typeof responses;
  const possibleResponses = responses[responseType] || responses.message;
  const randomIndex = Math.floor(Math.random() * possibleResponses.length);
  
  return possibleResponses[randomIndex];
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
