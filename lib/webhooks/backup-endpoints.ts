import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { WebhookRetryManager } from './retry-manager';

interface BackupConfig {
  maxEndpoints: number;
  healthCheckInterval: number;
  failureThreshold: number;
}

interface BackupEndpoint {
  url: string;
  isHealthy: boolean;
  failureCount: number;
  lastCheck: number;
}

export class BackupEndpointManager {
  private redis: Redis;
  private logger: Logger;
  private retryManager: WebhookRetryManager;
  private config: BackupConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.retryManager = new WebhookRetryManager();
    this.config = {
      maxEndpoints: 3,
      healthCheckInterval: 60000, // 1 minute
      failureThreshold: 3
    };
  }

  async registerBackupEndpoint(url: string): Promise<void> {
    const endpoints = await this.getEndpoints();
    
    if (endpoints.length >= this.config.maxEndpoints) {
      throw new Error('Maximum number of backup endpoints reached');
    }

    const endpoint: BackupEndpoint = {
      url,
      isHealthy: true,
      failureCount: 0,
      lastCheck: Date.now()
    };

    await this.redis.hset('backup_endpoints', {
      [url]: JSON.stringify(endpoint)
    });
  }

  async getHealthyEndpoint(): Promise<string | null> {
    const endpoints = await this.getEndpoints();
    const healthyEndpoints = endpoints.filter(e => e.isHealthy);
    
    if (healthyEndpoints.length === 0) {
      return null;
    }

    // Round-robin selection among healthy endpoints
    const index = Math.floor(Math.random() * healthyEndpoints.length);
    return healthyEndpoints[index].url;
  }

  async handleEndpointFailure(url: string): Promise<void> {
    const endpoint = await this.getEndpoint(url);
    if (!endpoint) return;

    endpoint.failureCount++;
    
    if (endpoint.failureCount >= this.config.failureThreshold) {
      endpoint.isHealthy = false;
      this.logger.warn('Backup endpoint marked unhealthy', { url });
    }

    await this.updateEndpoint(url, endpoint);
  }

  async handleEndpointSuccess(url: string): Promise<void> {
    const endpoint = await this.getEndpoint(url);
    if (!endpoint) return;

    endpoint.failureCount = 0;
    endpoint.isHealthy = true;
    await this.updateEndpoint(url, endpoint);
  }

  private async getEndpoints(): Promise<BackupEndpoint[]> {
    const data = await this.redis.hgetall('backup_endpoints');
    return Object.values(data).map(e => JSON.parse(e as string));
  }

  private async getEndpoint(url: string): Promise<BackupEndpoint | null> {
    const data = await this.redis.hget('backup_endpoints', url);
    return data ? JSON.parse(data) : null;
  }

  private async updateEndpoint(url: string, endpoint: BackupEndpoint): Promise<void> {
    await this.redis.hset('backup_endpoints', {
      [url]: JSON.stringify(endpoint)
    });
  }

  async performHealthChecks(): Promise<void> {
    const endpoints = await this.getEndpoints();
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url + '/health');
        
        if (response.ok) {
          await this.handleEndpointSuccess(endpoint.url);
        } else {
          await this.handleEndpointFailure(endpoint.url);
        }
      } catch (error) {
        await this.handleEndpointFailure(endpoint.url);
      }
    }
  }
}
