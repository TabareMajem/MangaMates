import { supabase } from '@/lib/supabase/client';
import { instagramService } from './instagram-service';
import { twitterService } from './twitter-service';
import type { SocialMediaAnalysis } from '@/types/profile';

class SocialAnalysisService {
  async analyzePlatform(platform: 'instagram' | 'twitter', userId: string): Promise<SocialMediaAnalysis> {
    // Get integration
    const { data: integration } = await supabase
      .from('social_integrations')
      .select()
      .eq('user_id', userId)
      .eq('platform', platform)
      .single();

    if (!integration) {
      throw new Error('Platform not connected');
    }

    // Get analysis based on platform
    const analysis = platform === 'instagram' 
      ? await instagramService.analyzeProfile(integration.access_token)
      : await twitterService.analyzeProfile(integration.access_token);

    // Save analysis
    await supabase.from('social_analysis').insert({
      user_id: userId,
      platform,
      analysis,
      created_at: new Date().toISOString()
    });

    return {
      platform,
      contentAnalysis: {
        topics: analysis.interests,
        sentimentDistribution: {
          positive: 0.6,
          neutral: 0.3,
          negative: 0.1
        },
        interests: analysis.interests,
        behaviorPatterns: []
      },
      personalityIndicators: {
        extroversion: analysis.personality.extraversion,
        creativity: analysis.personality.openness,
        empathy: 0.7
      }
    };
  }
}

export const socialAnalysisService = new SocialAnalysisService();
