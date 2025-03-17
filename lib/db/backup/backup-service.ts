import { logError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';
import { S3 } from 'aws-sdk';

interface BackupConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number; // days
  compressionEnabled: boolean;
}

export class BackupService {
  private s3: S3;
  private redis: Redis;

  constructor(private config: BackupConfig) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION
    });
    this.redis = Redis.fromEnv();
  }

  async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString();
    const tables = await this.getTables();

    try {
      for (const table of tables) {
        await this.backupTable(table, timestamp);
      }

      await this.recordBackupSuccess(timestamp);
      await this.cleanupOldBackups();
    } catch (error) {
      await this.recordBackupFailure(error as Error);
      throw error;
    }
  }

  private async backupTable(table: string, timestamp: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) throw error;

    const content = this.config.compressionEnabled
      ? await this.compressData(data)
      : JSON.stringify(data);

    const key = `backups/${timestamp}/${table}.${this.config.compressionEnabled ? 'gz' : 'json'}`;

    await this.uploadToS3(key, content);
  }

  private async compressData(data: any): Promise<Buffer> {
    const { gzip } = await import('zlib');
    const { promisify } = await import('util');
    const gzipAsync = promisify(gzip);
    
    return gzipAsync(JSON.stringify(data));
  }

  private async uploadToS3(key: string, body: string | Buffer): Promise<void> {
    await this.s3.putObject({
      Bucket: process.env.AWS_BACKUP_BUCKET!,
      Key: key,
      Body: body,
      ContentType: this.config.compressionEnabled ? 'application/gzip' : 'application/json',
      ServerSideEncryption: 'AES256'
    }).promise();
  }

  private async getTables(): Promise<string[]> {
    const { data, error } = await supabase
      .rpc('get_table_names');

    if (error) throw error;
    return data;
  }

  private async recordBackupSuccess(timestamp: string): Promise<void> {
    await supabase
      .from('backup_logs')
      .insert({
        timestamp,
        status: 'success',
        type: this.config.frequency
      });

    await this.redis.set(`last_backup:${this.config.frequency}`, timestamp);
  }

  private async recordBackupFailure(error: Error): Promise<void> {
    await supabase
      .from('backup_logs')
      .insert({
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error.message,
        type: this.config.frequency
      });

    logError(error, { context: 'Database Backup' });
  }

  private async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention);

    const { Contents } = await this.s3.listObjects({
      Bucket: process.env.AWS_BACKUP_BUCKET!,
      Prefix: 'backups/'
    }).promise();

    if (!Contents) return;

    const oldBackups = Contents.filter(obj => 
      obj.LastModified && obj.LastModified < cutoffDate
    );

    if (oldBackups.length === 0) return;

    await this.s3.deleteObjects({
      Bucket: process.env.AWS_BACKUP_BUCKET!,
      Delete: {
        Objects: oldBackups.map(obj => ({ Key: obj.Key! }))
      }
    }).promise();
  }
}
