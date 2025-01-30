import { logError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      latency?: number;
      error?: string;
      lastChecked: Date;
    };
  };
  timestamp: Date;
}

export class HealthCheckSystem {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async runHealthChecks(): Promise<HealthStatus> {
    const checks: HealthStatus['checks'] = {};
    let overallStatus: HealthStatus['status'] = 'healthy';

    // Database Health Check
    try {
      const start = Date.now();
      await supabase.from('health_checks').select('count').single();
      checks.database = {
        status: 'healthy',
        latency: Date.now() - start,
        lastChecked: new Date()
      };
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date()
      };
      overallStatus = 'unhealthy';
      logError(error, { context: 'Health Check - Database' });
    }

    // Redis Health Check
    try {
      const start = Date.now();
      await this.redis.ping();
      checks.redis = {
        status: 'healthy',
        latency: Date.now() - start,
        lastChecked: new Date()
      };
    } catch (error) {
      checks.redis = {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date()
      };
      overallStatus = 'unhealthy';
      logError(error, { context: 'Health Check - Redis' });
    }

    // External API Health Checks
    const externalChecks = await this.checkExternalServices();
    Object.assign(checks, externalChecks);

    if (Object.values(checks).some(c => c.status === 'unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (Object.values(checks).some(c => c.latency! > 1000)) {
      overallStatus = 'degraded';
    }

    const status: HealthStatus = {
      status: overallStatus,
      checks,
      timestamp: new Date()
    };

    await this.storeHealthStatus(status);
    return status;
  }

  private async checkExternalServices() {
    const checks: HealthStatus['checks'] = {};
    const services = [
      { name: 'openai', url: 'https://api.openai.com/v1/models' },
      { name: 'stripe', url: 'https://api.stripe.com/v1/health' }
    ];

    for (const service of services) {
      try {
        const start = Date.now();
        const response = await fetch(service.url, {
          headers: {
            Authorization: `Bearer ${process.env[`${service.name.toUpperCase()}_API_KEY`]}`
          }
        });

        checks[service.name] = {
          status: response.ok ? 'healthy' : 'unhealthy',
          latency: Date.now() - start,
          lastChecked: new Date()
        };
      } catch (error) {
        checks[service.name] = {
          status: 'unhealthy',
          error: error.message,
          lastChecked: new Date()
        };
        logError(error, { context: `Health Check - ${service.name}` });
      }
    }

    return checks;
  }

  private async storeHealthStatus(status: HealthStatus) {
    await this.redis.set('health:latest', status);
    await this.redis.zadd('health:history', {
      score: Date.now(),
      member: JSON.stringify(status)
    });
    // Keep only last 24 hours of health checks
    await this.redis.zremrangebyscore(
      'health:history',
      0,
      Date.now() - 24 * 60 * 60 * 1000
    );
  }
}
