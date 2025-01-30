import type { InstagramPost, InstagramProfile } from '@/types/social';
import { supabase } from '../supabase';

export class InstagramAPI {
  private readonly accessToken: string;
  private readonly apiBase = 'https://graph.instagram.com/v12.0';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getProfile(): Promise<InstagramProfile> {
    const response = await fetch(
      `${this.apiBase}/me?fields=id,username,account_type&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram profile');
    }

    const data = await response.json();
    return {
      id: data.id,
      username: data.username,
      accountType: data.account_type,
      platform: 'instagram'
    };
  }

  async getPosts(limit = 20): Promise<InstagramPost[]> {
    const response = await fetch(
      `${this.apiBase}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }

    const data = await response.json();
    return data.data.map(this.transformPost);
  }

  private transformPost(post: any): InstagramPost {
    return {
      id: post.id,
      type: post.media_type.toLowerCase(),
      caption: post.caption || '',
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      permalink: post.permalink,
      createdAt: post.timestamp,
      platform: 'instagram',
      metrics: {
        likes: 0, // Basic API doesn't provide metrics
        comments: 0,
        shares: 0
      }
    };
  }

  async cacheProfile(profile: InstagramProfile): Promise<void> {
    const { error } = await supabase
      .from('social_profiles')
      .upsert({
        id: profile.id,
        platform: 'instagram',
        username: profile.username,
        account_type: profile.accountType,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async cachePosts(posts: InstagramPost[]): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .upsert(
        posts.map(post => ({
          id: post.id,
          platform: 'instagram',
          type: post.type,
          caption: post.caption,
          media_url: post.mediaUrl,
          thumbnail_url: post.thumbnailUrl,
          permalink: post.permalink,
          created_at: post.createdAt,
          metrics: post.metrics,
          updated_at: new Date().toISOString()
        }))
      );

    if (error) throw error;
  }
}
