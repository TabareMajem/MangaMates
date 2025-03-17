import { logError } from '@/lib/monitoring';
import { Pool } from 'pg';

interface PoolConfig {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export class ConnectionPool {
  private pool: Pool;
  private static instance: ConnectionPool;

  private constructor(config: PoolConfig) {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ...config,
      ssl: process.env.NODE_ENV === 'production'
    });

    this.setupPoolEvents();
  }

  static getInstance(config: PoolConfig): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool(config);
    }
    return ConnectionPool.instance;
  }

  async query<T>(text: string, params: any[] = []): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows as T[];
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private setupPoolEvents() {
    this.pool.on('error', (err) => {
      logError(err, { context: 'Database Pool Error' });
    });

    this.pool.on('connect', () => {
      console.log('New client connected to pool');
    });

    this.pool.on('remove', () => {
      console.log('Client removed from pool');
    });
  }

  async end() {
    await this.pool.end();
  }
}
