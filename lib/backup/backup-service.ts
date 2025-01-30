import { logError } from '@/lib/monitoring';
import { createClient } from '@supabase/supabase-js';
import { S3 } from 'aws-sdk';

export class BackupService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  private s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION
  });

  async createBackup() {
    try {
      const timestamp = new Date().toISOString();
      const tables = ['users', 'journal_entries', 'analytics_events'];

      for (const table of tables) {
        const { data, error } = await this.supabase
          .from(table)
          .select('*');

        if (error) throw error;

        await this.uploadToS3(
          `backups/${table}/${timestamp}.json`,
          JSON.stringify(data)
        );
      }

      await this.recordBackupSuccess(timestamp);
    } catch (error) {
      await this.recordBackupFailure(error as Error);
      throw error;
    }
  }

  private async uploadToS3(key: string, body: string) {
    await this.s3.putObject({
      Bucket: process.env.AWS_BACKUP_BUCKET!,
      Key: key,
      Body: body,
      ContentType: 'application/json'
    }).promise();
  }

  private async recordBackupSuccess(timestamp: string) {
    await this.supabase
      .from('backup_logs')
      .insert({
        timestamp,
        status: 'success'
      });
  }

  private async recordBackupFailure(error: Error) {
    await this.supabase
      .from('backup_logs')
      .insert({
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error.message
      });

    logError(error, { context: 'backup' });
  }
}
