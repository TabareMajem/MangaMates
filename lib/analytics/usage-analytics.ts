import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export interface UsageMetrics {
  totalEntries: number;
  aiAnalyses: number;
  characterChats: number;
  storageUsed: number;
  lastActive: Date;
}

export interface UsageTrend {
  date: string;
  entries: number;
  aiCalls: number;
  characterChats: number;
}

export class UsageAnalytics {
  private static readonly METRICS_KEY = 'usage_metrics:';
  private static readonly DAILY_STATS_KEY = 'daily_stats:';

  static async trackEvent(userId: string, event: {
    type: string;
    metadata?: Record<string, any>;
  }) {
    const timestamp = new Date().toISOString();

    // Store event in database
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_type: event.type,
      metadata: event.metadata,
      timestamp
    });

    // Update Redis metrics
    const metricsKey = `${this.METRICS_KEY}${userId}`;
    const dailyKey = `${this.DAILY_STATS_KEY}${userId}:${timestamp.slice(0, 10)}`;

    await Promise.all([
      redis.hincrby(metricsKey, event.type, 1),
      redis.hincrby(dailyKey, event.type, 1)
    ]);
  }

  static async getUserMetrics(userId: string): Promise<UsageMetrics> {
    // Get cached metrics
    const metricsKey = `${this.METRICS_KEY}${userId}`;
    const cachedMetrics = await redis.hgetall<Record<string, number>>(metricsKey);

    if (cachedMetrics) {
      return {
        totalEntries: cachedMetrics.entries || 0,
        aiAnalyses: cachedMetrics.ai_analyses || 0,
        characterChats: cachedMetrics.character_chats || 0,
        storageUsed: cachedMetrics.storage_used || 0,
        lastActive: new Date(cachedMetrics.last_active || Date.now())
      };
    }

    // Fallback to database query
    const { data: metrics } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', userId)
      .single();

    return metrics || {
      totalEntries: 0,
      aiAnalyses: 0,
      characterChats: 0,
      storageUsed: 0,
      lastActive: new Date()
    };
  }

  static async getUsageTrends(userId: string, days = 30): Promise<UsageTrend[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: trends } = await supabase
      .from('analytics_events')
      .select('event_type, timestamp')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    // Process and aggregate data
    const dailyStats = new Map<string, UsageTrend>();
    
    trends?.forEach(event => {
      const date = event.timestamp.slice(0, 10);
      const stats = dailyStats.get(date) || {
        date,
        entries: 0,
        aiCalls: 0,
        characterChats: 0
      };

      switch (event.event_type) {
        case 'journal_entry':
          stats.entries++;
          break;
        case 'ai_analysis':
          stats.aiCalls++;
          break;
        case 'character_chat':
          stats.characterChats++;
          break;
      }

      dailyStats.set(date, stats);
    });

    return Array.from(dailyStats.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
  }
}
