import { EmailService } from '@/lib/email/email-service';
import { Logger } from '@/lib/monitoring/logger';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';
import { createHash, randomBytes } from 'crypto';

interface ResetConfig {
  tokenExpiry: number; // in seconds
  maxAttempts: number;
  cooldownPeriod: number; // in seconds
}

export class PasswordResetManager {
  private redis: Redis;
  private logger: Logger;
  private emailService: EmailService;
  private config: ResetConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.emailService = new EmailService();
    this.config = {
      tokenExpiry: 30 * 60, // 30 minutes
      maxAttempts: 3,
      cooldownPeriod: 60 * 60 // 1 hour
    };
  }

  async initiateReset(email: string): Promise<boolean> {
    try {
      // Check rate limiting
      const attempts = await this.getResetAttempts(email);
      if (attempts >= this.config.maxAttempts) {
        this.logger.warn('Too many reset attempts', { email });
        return false;
      }

      // Generate and store token
      const token = this.generateResetToken();
      const tokenHash = this.hashToken(token);
      
      await this.redis.set(
        `pwd_reset:${tokenHash}`,
        email,
        { ex: this.config.tokenExpiry }
      );

      // Increment attempts
      await this.incrementResetAttempts(email);

      // Send reset email
      await this.emailService.sendPasswordReset(email, token);

      return true;
    } catch (error) {
      this.logger.error('Password reset initiation failed', error as Error);
      return false;
    }
  }

  async validateResetToken(token: string): Promise<string | null> {
    const tokenHash = this.hashToken(token);
    const email = await this.redis.get(`pwd_reset:${tokenHash}`);
    return email;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const email = await this.validateResetToken(token);
    if (!email) return false;

    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password: newPassword
      });

      if (error) throw error;

      // Invalidate token
      const tokenHash = this.hashToken(token);
      await this.redis.del(`pwd_reset:${tokenHash}`);

      // Reset attempts
      await this.resetAttempts(email);

      // Send confirmation email
      await this.emailService.sendPasswordResetConfirmation(email);

      return true;
    } catch (error) {
      this.logger.error('Password reset failed', error as Error);
      return false;
    }
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async getResetAttempts(email: string): Promise<number> {
    const attempts = await this.redis.get(`pwd_reset_attempts:${email}`);
    return parseInt(attempts || '0');
  }

  private async incrementResetAttempts(email: string): Promise<void> {
    await this.redis.incr(`pwd_reset_attempts:${email}`);
    await this.redis.expire(
      `pwd_reset_attempts:${email}`,
      this.config.cooldownPeriod
    );
  }

  private async resetAttempts(email: string): Promise<void> {
    await this.redis.del(`pwd_reset_attempts:${email}`);
  }
}
