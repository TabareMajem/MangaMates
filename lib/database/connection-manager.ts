import { Logger } from '@/lib/monitoring/logger';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

interface DatabaseConfig {
  maxConnections: number;
  minConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  replicaUrls: string[];
}

export class DatabaseManager {
  private primaryClient: SupabaseClient;
  private replicaClients: SupabaseClient[];
  private currentReplicaIndex: number;
  private logger: Logger;
  private redis: Redis;
  private config: DatabaseConfig;

  constructor() {
    this.logger = new Logger();
    this.redis = Redis.fromEnv();
    this.config = {
      maxConnections: 20,
      minConnections: 2,
      connectionTimeout: 30000,
      idleTimeout: 10000,
      replicaUrls: process.env.SUPABASE_REPLICA_URLS?.split(',') || []
    };

    this.primaryClient = this.createClient(process.env.SUPABASE_URL!);
    this.replicaClients = this.config.replicaUrls.map(url => this.createClient(url));
    this.currentReplicaIndex = 0;
  }

  private createClient(url: string): SupabaseClient {
    return createClient(url, process.env.SUPABASE_KEY!, {
      auth: {
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
  }

  async read<T>(query: (client: SupabaseClient) => Promise<T>): Promise<T> {
    const client = this.getNextReplica();
    try {
      return await query(client);
    } catch (error) {
      this.logger.error('Read query failed', error as Error);
      // Fallback to primary on replica failure
      return await query(this.primaryClient);
    }
  }

  async write<T>(query: (client: SupabaseClient) => Promise<T>): Promise<T> {
    try {
      return await query(this.primaryClient);
    } catch (error) {
      this.logger.error('Write query failed', error as Error);
      throw error;
    }
  }

  private getNextReplica(): SupabaseClient {
    if (this.replicaClients.length === 0) {
      return this.primaryClient;
    }
    
    this.currentReplicaIndex = (this.currentReplicaIndex + 1) % this.replicaClients.length;
    return this.replicaClients[this.currentReplicaIndex];
  }

  async healthCheck(): Promise<{
    primary: boolean;
    replicas: boolean[];
  }> {
    const primary = await this.checkConnection(this.primaryClient);
    const replicas = await Promise.all(
      this.replicaClients.map(client => this.checkConnection(client))
    );

    return { primary, replicas };
  }

  private async checkConnection(client: SupabaseClient): Promise<boolean> {
    try {
      await client.from('health_check').select('count').single();
      return true;
    } catch {
      return false;
    }
  }
}
