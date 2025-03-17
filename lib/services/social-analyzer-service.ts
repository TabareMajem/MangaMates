import { instagramClient } from '@/lib/social/instagram-client';
import { supabase } from '@/lib/supabase';
import { OpenAI } from 'openai';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const socialAnalyzerService = {
  // Analyze Twitter profile without API
  async analyzeTwitterProfile(username: string) {
    try {
      // Use public data instead of API
      const twitterData = await this.getPublicTwitterData(username);
      
      // Analyze with AI
      const analysis = await this.analyzeWithAI({
        platform: 'Twitter',
        username,
        content: twitterData.tweets.join('\n\n')
      });
      
      // Store analysis in database
      await this.storeAnalysis({
        user_id: null, // We don't have the Twitter user ID
        platform: 'twitter',
        username,
        analysis,
        raw_data: JSON.stringify(twitterData)
      });
      
      return {
        profile: {
          username,
          name: twitterData.name,
          bio: twitterData.bio
        },
        tweets: twitterData.tweets.map(tweet => ({ text: tweet })),
        analysis
      };
    } catch (error) {
      console.error('Twitter analysis error:', error);
      throw error;
    }
  },
  
  // Get public Twitter data without API
  async getPublicTwitterData(username: string) {
    try {
      // This is a simplified example - in production, you'd need a more robust solution
      // like a serverless function or a third-party service to avoid CORS issues
      
      // For demo purposes, we'll return mock data
      return {
        name: username,
        bio: `This is a simulated bio for ${username}`,
        tweets: [
          `This is a simulated tweet from ${username} about AI and technology.`,
          `Another simulated tweet from ${username} discussing current events.`,
          `${username} shares thoughts on the latest industry trends.`,
          `A post from ${username} about personal interests and hobbies.`,
          `${username} engages with followers about important topics.`
        ]
      };
      
      // In a real implementation, you might use a service like:
      // const response = await axios.get(`https://your-scraping-service.com/twitter/${username}`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
      throw new Error('Failed to fetch Twitter data');
    }
  },
  
  // Analyze Instagram profile
  async analyzeInstagramProfile(accessToken: string) {
    try {
      // Get user profile
      const profile = await instagramClient.getUserProfile(accessToken);
      
      // Get recent media
      const media = await instagramClient.getUserMedia(accessToken, 20);
      
      // Extract captions for analysis
      const captions = media.data
        .filter((item: any) => item.caption)
        .map((item: any) => item.caption)
        .join('\n\n');
      
      // Analyze with AI
      const analysis = await this.analyzeWithAI({
        platform: 'Instagram',
        username: profile.username,
        content: captions
      });
      
      // Store analysis in database
      await this.storeAnalysis({
        user_id: profile.id,
        platform: 'instagram',
        username: profile.username,
        analysis,
        raw_data: JSON.stringify({
          profile,
          media: media.data
        })
      });
      
      return {
        profile,
        media: media.data,
        analysis
      };
    } catch (error) {
      console.error('Instagram analysis error:', error);
      throw error;
    }
  },
  
  // Use AI to analyze social media content
  async analyzeWithAI({ platform, username, content }: { platform: string, username: string, content: string }) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a social media analyst. Analyze the following ${platform} content from user ${username} and provide insights about their personality, interests, communication style, and potential character traits.`
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      return completion.choices[0].message.content || "Analysis could not be generated.";
    } catch (error) {
      console.error('AI analysis error:', error);
      return "Error generating analysis. Please try again later.";
    }
  },
  
  // Store analysis in database
  async storeAnalysis({ user_id, platform, username, analysis, raw_data }: any) {
    try {
      await supabase
        .from('social_media_analyses')
        .insert({
          user_id,
          platform,
          username,
          analysis,
          raw_data,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error storing analysis:', error);
      // Continue even if storage fails
    }
  }
}; 