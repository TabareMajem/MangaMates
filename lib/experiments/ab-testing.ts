import { Redis } from '@upstash/redis';

interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
  startDate: Date;
  endDate?: Date;
}

interface ExperimentResult {
  experimentId: string;
  variant: string;
  userId: string;
  conversion: boolean;
  timestamp: Date;
}

export class ABTestingService {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async assignVariant(experimentId: string, userId: string): Promise<string> {
    // Check for existing assignment
    const existingVariant = await this.redis.get<string>(`exp:${experimentId}:user:${userId}`);
    if (existingVariant) return existingVariant;

    // Get experiment config
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) throw new Error(`Experiment ${experimentId} not found`);

    // Assign variant
    const variant = this.selectVariant(experiment);
    await this.redis.set(`exp:${experimentId}:user:${userId}`, variant);

    // Track assignment
    await this.trackAssignment(experimentId, variant);

    return variant;
  }

  async trackConversion(experimentId: string, userId: string): Promise<void> {
    const variant = await this.redis.get<string>(`exp:${experimentId}:user:${userId}`);
    if (!variant) return;

    const result: ExperimentResult = {
      experimentId,
      variant,
      userId,
      conversion: true,
      timestamp: new Date()
    };

    await this.redis.lpush(`exp:${experimentId}:conversions`, JSON.stringify(result));
  }

  private selectVariant(experiment: Experiment): string {
    const weights = experiment.weights || experiment.variants.map(() => 1 / experiment.variants.length);
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return experiment.variants[i];
    }

    return experiment.variants[0];
  }

  private async trackAssignment(experimentId: string, variant: string): Promise<void> {
    await this.redis.hincrby(`exp:${experimentId}:assignments`, variant, 1);
  }

  private async getExperiment(id: string): Promise<Experiment | null> {
    return this.redis.get<Experiment>(`exp:${id}`);
  }

  async getResults(experimentId: string): Promise<{
    assignments: Record<string, number>;
    conversions: Record<string, number>;
    conversionRates: Record<string, number>;
  }> {
    const assignments = await this.redis.hgetall<Record<string, string>>(`exp:${experimentId}:assignments`);
    const conversions = await this.redis.lrange<string>(`exp:${experimentId}:conversions`, 0, -1);

    const conversionCounts: Record<string, number> = {};
    conversions.forEach(conv => {
      const result = JSON.parse(conv) as ExperimentResult;
      conversionCounts[result.variant] = (conversionCounts[result.variant] || 0) + 1;
    });

    const conversionRates: Record<string, number> = {};
    Object.entries(assignments).forEach(([variant, count]) => {
      conversionRates[variant] = (conversionCounts[variant] || 0) / parseInt(count);
    });

    return {
      assignments: Object.fromEntries(
        Object.entries(assignments).map(([k, v]) => [k, parseInt(v)])
      ),
      conversions: conversionCounts,
      conversionRates
    };
  }
}
