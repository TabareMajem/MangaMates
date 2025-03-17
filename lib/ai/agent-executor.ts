import { generateResponse } from '@/lib/ai/character-ai';
import { kakaoClient } from '@/lib/messaging/kakao-client';
import { lineClient } from '@/lib/messaging/line-client';
import { getCharacter } from '@/lib/services/character-service';

export async function executeAgentAction(
  agentId: string,
  action: string
): Promise<void> {
  // Get agent/character data
  const character = await getCharacter(agentId);
  if (!character) throw new Error('Agent not found');

  // Generate response based on action
  const response = await generateResponse(character, {
    type: 'task',
    content: action
  });

  // Handle the response based on channels
  await Promise.all([
    character.lineChannelId && sendLineMessage(character.lineChannelId, response),
    character.kakaoChannelId && sendKakaoMessage(character.kakaoChannelId, response)
  ]);
}

async function sendLineMessage(channelId: string, content: string) {
  try {
    await lineClient.pushMessage(channelId, {
      type: 'text',
      text: content
    });
  } catch (error) {
    console.error('Failed to send Line message:', error);
    throw error;
  }
}

async function sendKakaoMessage(channelId: string, content: string) {
  try {
    await kakaoClient.sendMessage(channelId, {
      type: 'text',
      text: content
    });
  } catch (error) {
    console.error('Failed to send Kakao message:', error);
    throw error;
  }
}
