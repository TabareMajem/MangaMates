import { EmailService } from '@/lib/email/email-service';
import { Logger } from '@/lib/monitoring/logger';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import { SessionManager } from './session-manager';

interface DeletionConfig {
  confirmationExpiry: number; // in seconds
  dataDeletionDelay: number; // in seconds
}

export class AccountDeletionManager {
  private redis: Redis;
  private logger: Logger;
  private emailService: EmailService;
  private sessionManager: SessionManager;
  private config: DeletionConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.emailService = new EmailService();
    this.sessionManager = new SessionManager();
    this.config = {
      confirmationExpiry: 24 * 60 * 60, // 24 hours
      dataDeletionDelay: 30 * 24 * 60 * 60 // 30 days
    };
  }

  async initiateDeletion(userId: string): Promise<string> {
    try {
      // Generate confirmation token
      const token = this.generateToken();
      
      // Store deletion request
      await this.redis.set(
        `account_deletion:${token}`,
        userId,
        { ex: this.config.confirmationExpiry }
      );

      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      if (!user?.email) throw new Error('User not found');

      // Send confirmation email
      await this.emailService.sendDeletionConfirmation(user.email, token);

      return token;
    } catch (error) {
      this.logger.error('Account deletion initiation failed', error as Error);
      throw error;
    }
  }

  async confirmDeletion(token: string): Promise<boolean> {
    try {
      const userId = await this.redis.get<string>(`account_deletion:${token}`);
      if (!userId) {
        throw new Error('Invalid or expired deletion token');
      }

      // Schedule data deletion
      await this.scheduleDeletion(userId);

      // Revoke all sessions
      await this.sessionManager.revokeUserSessions(userId);

      // Disable account immediately
      await supabase.auth.admin.updateUser(userId, {
        ban_duration: 'infinite'
      });

      // Remove deletion token
      await this.redis.del(`account_deletion:${token}`);

      return true;
    } catch (error) {
      this.logger.error('Account deletion confirmation failed', error as Error);
      return false;
    }
  }

  private async scheduleDeletion(userId: string): Promise<void> {
    // Store deletion schedule
    await this.redis.set(
      `scheduled_deletion:${userId}`,
      Date.now(),
      { ex: this.config.dataDeletionDelay }
    );

    // Add to deletion queue
    await this.redis.zadd(
      'account_deletion_queue',
      Date.now() + this.config.dataDeletionDelay * 1000,
      userId
    );
  }

  async processDeletionQueue(): Promise<void> {
    try {
      const now = Date.now();
      const userIds = await this.redis.zrangebyscore(
        'account_deletion_queue',
        0,
        now
      );

      for (const userId of userIds) {
        await this.deleteUserData(userId);
        await this.redis.zrem('account_deletion_queue', userId);
      }
    } catch (error) {
      this.logger.error('Deletion queue processing failed', error as Error);
    }
  }

  private async deleteUserData(userId: string): Promise<void> {
    try {
      // Delete user data from all tables
      await Promise.all([
        supabase.from('user_preferences').delete().eq('user_id', userId),
        supabase.from('user_2fa').delete().eq('user_id', userId),
        supabase.from('line_users').delete().eq('user_id', userId),
        supabase.from('kakao_users').delete().eq('user_id', userId),
        // Add other tables as needed
      ]);

      // Finally, delete the user account
      await supabase.auth.admin.deleteUser(userId);

      this.logger.info('User data deleted successfully', { userId });
    } catch (error) {
      this.logger.error('User data deletion failed', error as Error);
      throw error;
    }
  }

  private generateToken(): string {
    return createHash('sha256')
      .update(`${Date.now()}-${Math.random()}`)
      .digest('hex');
  }
}
