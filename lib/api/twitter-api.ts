import type { TwitterPost, TwitterProfile } from '@/types/social';
import { supabase } from '../supabase';

export class TwitterAPI {
  private readonly accessToken: string;
  private readonly apiBase = 'https://api.twitter.com/2';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getProfile(): Promise<TwitterProfile> {
    const response = await fetch(
      `${this.apiBase}/users/me?user.fields=id,username,name,description`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const data = await response.json();
    return {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name,
      description: data.data.description,
      platform: 'twitter'
    };
  }

  async getTweets(limit = 20): Promise<TwitterPost[]> {
    const response = await fetch(
      `${this.apiBase}/users/me/tweets?max_results=${limit}&tweet.fields=created_at,public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const data = await response.json();
    return data.data.map(this.transformTweet);
  }

  private transformTweet(tweet: any): TwitterPost {
    return {
      id: tweet.id,
      content: tweet.text,
      createdAt: tweet.created_at,
      platform: 'twitter',
      metrics: {
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        replies: tweet.public_metrics.reply_count,
        quotes: tweet.public_metrics.quote_count
      }
    };
  }

  async cacheProfile(profile: TwitterProfile): Promise<void> {
    const { error } = await supabase
      .from('social_profiles')
      .upsert({
        id: profile.id,
        platform: 'twitter',
        username: profile.username,
        name: profile.name,
        description: profile.description,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async cacheTweets(tweets: TwitterPost[]): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .upsert(
        tweets.map(tweet => ({
          id: tweet.id,
          platform: 'twitter',
          content: tweet.content,
          created_at: tweet.createdAt,
          metrics: tweet.metrics,
          updated_at: new Date().toISOString()
        }))
      );

    if (error) throw error;
  }
}
