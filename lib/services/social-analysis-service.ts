import type { SocialAnalysis, SocialPost, SocialProfile } from '@/types/social';
import { supabase } from '../supabase';

export class SocialAnalysisService {
  async analyzeSocialActivity(userId: string): Promise<SocialAnalysis> {
    try {
      const { data: activities, error } = await supabase
        .from('social_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return this.performAnalysis(activities || []);
    } catch (error) {
      console.error('Social analysis error:', error);
      throw error;
    }
  }

  private performAnalysis(activities: SocialPost[]): SocialAnalysis {
    const analysis: SocialAnalysis = {
      engagementRate: this.calculateEngagementRate(activities),
      topPlatforms: this.getTopPlatforms(activities),
      contentTypes: this.analyzeContentTypes(activities),
      peakTimes: this.analyzePeakTimes(activities),
      sentiment: this.analyzeSentiment(activities)
    };

    return analysis;
  }

  private calculateEngagementRate(activities: SocialPost[]): number {
    if (activities.length === 0) return 0;
    
    const totalEngagement = activities.reduce((sum, post) => {
      const metrics = post.metrics;
      return sum + (metrics.likes + (metrics.comments || 0) + (metrics.shares || 0));
    }, 0);

    return totalEngagement / activities.length;
  }

  private getTopPlatforms(activities: SocialPost[]): Record<string, number> {
    return activities.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private analyzeContentTypes(activities: SocialPost[]): Record<string, number> {
    return activities.reduce((acc, post) => {
      const type = post.type || 'text';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private analyzePeakTimes(activities: SocialPost[]): string[] {
    // Implementation coming soon
    return [];
  }

  private analyzeSentiment(activities: SocialPost[]): Record<string, number> {
    // Implementation coming soon
    return {};
  }

  async getProfileAnalytics(profile: SocialProfile): Promise<SocialAnalysis> {
    try {
      const { data: activities, error } = await supabase
        .from('social_activities')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return this.performAnalysis(activities || []);
    } catch (error) {
      console.error('Profile analytics error:', error);
      throw error;
    }
  }
}
