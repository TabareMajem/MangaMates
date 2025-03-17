import type { InstagramPost, InstagramProfile } from '@/types/social';
import { InstagramAPI } from '../api/instagram-api';
import { ErrorHandler } from '../error/error-handler';
import { RateLimiter } from '../middleware/rate-limiter';
import { supabase } from '../supabase';

export class InstagramService {
  private static readonly INSTAGRAM_CONFIG = {
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET,
    redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/instagram/callback`,
    scope: 'user_profile,user_media'
  };

  static async authorize() {
    const state = crypto.randomUUID();
    
    // Store state for verification
    await supabase.from('auth_states').insert({
      state,
      provider: 'instagram',
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Generate Instagram authorization URL
    const params = new URLSearchParams({
      client_id: this.INSTAGRAM_CONFIG.clientId!,
      redirect_uri: this.INSTAGRAM_CONFIG.redirectUri,
      scope: this.INSTAGRAM_CONFIG.scope,
      response_type: 'code',
      state
    });

    return {
      authUrl: `https://api.instagram.com/oauth/authorize?${params.toString()}`
    };
  }

  private readonly api: InstagramAPI;
  private readonly rateLimiter: RateLimiter;
  private readonly errorHandler: ErrorHandler;

  constructor(
    accessToken: string,
    rateLimiter = new RateLimiter({ windowMs: 60000, max: 100 }),
    errorHandler = new ErrorHandler()
  ) {
    this.api = new InstagramAPI(accessToken);
    this.rateLimiter = rateLimiter;
    this.errorHandler = errorHandler;
  }

  async getProfile(): Promise<InstagramProfile> {
    try {
      await this.rateLimiter.checkLimit('instagram:profile', 100, 3600);
      
      const profile = await this.api.getProfile();
      await this.api.cacheProfile(profile);
      
      return profile;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'instagram.getProfile'
      });
      throw error;
    }
  }

  async getPosts(limit = 20): Promise<InstagramPost[]> {
    try {
      await this.rateLimiter.checkLimit('instagram:posts', 200, 3600);
      
      const posts = await this.api.getPosts(limit);
      await this.api.cachePosts(posts);
      
      return posts;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'instagram.getPosts',
        limit
      });
      throw error;
    }
  }

  async syncPosts(): Promise<void> {
    try {
      const posts = await this.getPosts(50);
      
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
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'instagram.syncPosts'
      });
      throw error;
    }
  }

  async getEngagementStats(days = 30): Promise<{
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  }> {
    try {
      const { data: posts, error } = await supabase
        .from('social_posts')
        .select('metrics')
        .eq('platform', 'instagram')
        .gte('created_at', new Date(Date.now() - days * 86400000).toISOString());

      if (error) throw error;

      const stats = posts.reduce(
        (acc, post) => {
          const metrics = post.metrics;
          acc.likes += metrics.likes || 0;
          acc.comments += metrics.comments || 0;
          acc.shares += metrics.shares || 0;
          return acc;
        },
        { likes: 0, comments: 0, shares: 0 }
      );

      const totalEngagements = stats.likes + stats.comments + stats.shares;
      const engagementRate = posts.length ? totalEngagements / posts.length : 0;

      return {
        ...stats,
        engagementRate
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'instagram.getEngagementStats',
        days
      });
      throw error;
    }
  }

  async getTopPosts(limit = 10): Promise<InstagramPost[]> {
    try {
      const { data: posts, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('platform', 'instagram')
        .order('metrics->likes', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return posts.map(post => ({
        id: post.id,
        type: post.type,
        caption: post.caption,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        permalink: post.permalink,
        createdAt: post.created_at,
        platform: 'instagram',
        metrics: post.metrics
      }));
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'instagram.getTopPosts',
        limit
      });
      throw error;
    }
  }
}
