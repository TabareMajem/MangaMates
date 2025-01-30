import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

interface CostMetrics {
  aiTokens: number;
  storageBytes: number;
  computeSeconds: number;
  date: string;
}

export class CostCalculator {
  private redis: Redis;
  private readonly COST_PER_TOKEN = 0.0001;
  private readonly COST_PER_GB = 0.023;
  private readonly COST_PER_COMPUTE_HOUR = 0.0417;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async calculateCosts() {
    const metrics = await this.getMetrics();
    const daily = metrics.map(metric => ({
      date: metric.date,
      aiCosts: metric.aiTokens * this.COST_PER_TOKEN,
      storageCosts: (metric.storageBytes / 1024 / 1024 / 1024) * this.COST_PER_GB,
      computeCosts: (metric.computeSeconds / 3600) * this.COST_PER_COMPUTE_HOUR
    }));

    const total = daily.reduce(
      (sum, day) => sum + day.aiCosts + day.storageCosts + day.computeCosts,
      0
    );

    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();

    const projected = (total / new Date().getDate()) * daysInMonth;

    return {
      daily,
      total,
      projected
    };
  }

  private async getMetrics(): Promise<CostMetrics[]> {
    const { data, error } = await supabase
      .from('usage_metrics')
      .select('*')
      .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async trackUsage(metrics: Partial<CostMetrics>) {
    const date = new Date().toISOString().split('T')[0];
    
    await supabase
      .from('usage_metrics')
      .upsert({
        date,
        ...metrics
      });

    // Cache current day metrics
    await this.redis.hset(`usage:${date}`, metrics);
  }
}
