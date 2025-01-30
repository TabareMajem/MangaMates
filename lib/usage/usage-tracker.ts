import { subscriptionPlans } from '@/lib/stripe/subscription-service';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export class UsageTracker {
  private static readonly USAGE_KEY_PREFIX = 'usage:';
  private static readonly RATE_LIMIT_KEY_PREFIX = 'rate_limit:';

  static async trackApiCall(userId: string, feature: string) {
    const key = `${this.USAGE_KEY_PREFIX}${userId}:${feature}`;
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Increment usage counter
    await redis.hincrby(key, month, 1);

    // Store in database for persistence
    await supabase.from('usage_logs').insert({
      user_id: userId,
      feature,
      timestamp: new Date().toISOString()
    });
  }

  static async checkUsageLimit(userId: string, feature: string): Promise<boolean> {
    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', userId)
      .single();

    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const plan = subscriptionPlans.find(p => p.id === subscription.tier);
    if (!plan) return false;

    // Check current usage
    const key = `${this.USAGE_KEY_PREFIX}${userId}:${feature}`;
    const month = new Date().toISOString().slice(0, 7);
    const usage = await redis.hget(key, month);

    return Number(usage || 0) < plan.limits[feature];
  }
}
