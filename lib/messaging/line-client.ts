import { Client, ClientConfig, MessageAPIResponseBase } from '@line/bot-sdk';

// LINE client configuration
const lineConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

// Create a LINE client instance
const client = new Client(lineConfig);

// Wrapper for the LINE client with additional functionality
export const lineClient = {
  // Send a message to a user
  pushMessage: async (
    to: string, 
    message: any
  ): Promise<MessageAPIResponseBase> => {
    try {
      return await client.pushMessage(to, message);
    } catch (error) {
      console.error('LINE push message error:', error);
      throw error;
    }
  },
  
  // Send multiple messages to a user
  pushMessages: async (
    to: string, 
    messages: any[]
  ): Promise<MessageAPIResponseBase> => {
    try {
      return await client.pushMessage(to, messages);
    } catch (error) {
      console.error('LINE push messages error:', error);
      throw error;
    }
  },
  
  // Reply to a specific message
  replyMessage: async (
    replyToken: string, 
    message: any
  ): Promise<MessageAPIResponseBase> => {
    try {
      return await client.replyMessage(replyToken, message);
    } catch (error) {
      console.error('LINE reply message error:', error);
      throw error;
    }
  },
  
  // Get a user's profile
  getProfile: async (userId: string) => {
    try {
      return await client.getProfile(userId);
    } catch (error) {
      console.error('LINE get profile error:', error);
      throw error;
    }
  }
};
