import type { Tweet, TwitterProfile } from '@/types/social';
import { TwitterAPI } from '../api/twitter-api';
import { ErrorHandler } from '../error/error-handler';
import { RateLimiter } from '../middleware/rate-limiter';
import { supabase } from '../supabase';

export class TwitterService {
  private readonly api: TwitterAPI;
  private readonly rateLimiter: RateLimiter;
  private readonly errorHandler: ErrorHandler;

  constructor(
    accessToken: string,
    rateLimiter = new RateLimiter(),
    errorHandler = new ErrorHandler()
  ) {
    this.api = new TwitterAPI(accessToken);
    this.rateLimiter = rateLimiter;
    this.errorHandler = errorHandler;
  }

  async getProfile(): Promise<TwitterProfile> {
    try {
      await this.rateLimiter.checkLimit('twitter:profile', 100, 3600);
      
      const profile = await this.api.getProfile();
      await this.api.cacheProfile(profile);
      
      return profile;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'twitter.getProfile'
      });
      throw error;
    }
  }

  async getTweets(limit = 20): Promise<Tweet[]> {
    try {
      await this.rateLimiter.checkLimit('twitter:tweets', 200, 3600);
      
      const tweets = await this.api.getTweets(limit);
      await this.api.cacheTweets(tweets);
      
      return tweets;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'twitter.getTweets',
        limit
      });
      throw error;
    }
  }

  async syncTweets(): Promise<void> {
    try {
      const tweets = await this.getTweets(50);
      
      const { error } = await supabase
        .from('social_posts')
        .upsert(
          tweets.map(tweet => ({
            id: tweet.id,
            platform: 'twitter',
            type: 'tweet',
            content: tweet.text,
            media_urls: tweet.mediaUrls,
            permalink: tweet.permalink,
            created_at: tweet.createdAt,
            metrics: {
              likes: tweet.likeCount,
              retweets: tweet.retweetCount,
              replies: tweet.replyCount,
              quotes: tweet.quoteCount
            },
            updated_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'twitter.syncTweets'
      });
      throw error;
    }
  }

  async getEngagementStats(days = 30): Promise<{
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    engagementRate: number;
  }> {
    try {
      const { data: tweets, error } = await supabase
        .from('social_posts')
        .select('metrics')
        .eq('platform', 'twitter')
        .gte('created_at', new Date(Date.now() - days * 86400000).toISOString());

      if (error) throw error;

      const stats = tweets.reduce(
        (acc, tweet) => {
          const metrics = tweet.metrics;
          acc.likes += metrics.likes || 0;
          acc.retweets += metrics.retweets || 0;
          acc.replies += metrics.replies || 0;
          acc.quotes += metrics.quotes || 0;
          return acc;
        },
        { likes: 0, retweets: 0, replies: 0, quotes: 0 }
      );

      const totalEngagements = stats.likes + stats.retweets + stats.replies + stats.quotes;
      const engagementRate = tweets.length ? totalEngagements / tweets.length : 0;

      return {
        ...stats,
        engagementRate
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'twitter.getEngagementStats',
        days
      });
      throw error;
    }
  }

  async getTopTweets(limit = 10): Promise<Tweet[]> {
    try {
      const { data: tweets, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('platform', 'twitter')
        .order('metrics->likes', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return tweets.map(tweet => ({
        id: tweet.id,
        text: tweet.content,
        mediaUrls: tweet.media_urls,
        permalink: tweet.permalink,
        createdAt: tweet.created_at,
        likeCount: tweet.metrics.likes,
        retweetCount: tweet.metrics.retweets,
        replyCount: tweet.metrics.replies,
        quoteCount: tweet.metrics.quotes
      }));
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'twitter.getTopTweets',
        limit
      });
      throw error;
    }
  }
}
