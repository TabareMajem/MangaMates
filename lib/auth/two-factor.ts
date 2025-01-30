import { Logger } from '@/lib/monitoring/logger';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

interface TwoFactorConfig {
  backupCodesCount: number;
  maxVerifyAttempts: number;
  verifyTimeoutSeconds: number;
}

export class TwoFactorAuth {
  private redis: Redis;
  private logger: Logger;
  private config: TwoFactorConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.config = {
      backupCodesCount: 8,
      maxVerifyAttempts: 3,
      verifyTimeoutSeconds: 300 // 5 minutes
    };
  }

  async setupTwoFactor(userId: string): Promise<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  }> {
    try {
      // Generate secret
      const secret = authenticator.generateSecret();
      const appName = process.env.APP_NAME || 'YourApp';

      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      if (!user) throw new Error('User not found');

      // Generate QR code
      const otpauth = authenticator.keyuri(user.email, appName, secret);
      const qrCode = await QRCode.toDataURL(otpauth);

      // Generate backup codes
      const backupCodes = await this.generateBackupCodes(userId);

      // Store secret temporarily until verified
      await this.redis.set(
        `2fa_setup:${userId}`,
        JSON.stringify({ secret, backupCodes }),
        { ex: this.config.verifyTimeoutSeconds }
      );

      return {
        secret,
        qrCode,
        backupCodes
      };
    } catch (error) {
      this.logger.error('2FA setup failed', error as Error);
      throw error;
    }
  }

  async verifyAndEnableTwoFactor(userId: string, token: string): Promise<boolean> {
    try {
      const setupData = await this.redis.get<string>(`2fa_setup:${userId}`);
      if (!setupData) {
        throw new Error('2FA setup expired');
      }

      const { secret, backupCodes } = JSON.parse(setupData);

      // Verify token
      const isValid = authenticator.verify({
        token,
        secret
      });

      if (!isValid) {
        throw new Error('Invalid 2FA token');
      }

      // Store 2FA data permanently
      await supabase
        .from('user_2fa')
        .upsert({
          user_id: userId,
          secret: this.encrypt(secret),
          backup_codes: backupCodes,
          enabled: true
        });

      // Cleanup setup data
      await this.redis.del(`2fa_setup:${userId}`);

      return true;
    } catch (error) {
      this.logger.error('2FA verification failed', error as Error);
      return false;
    }
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    try {
      // Check rate limiting
      const attempts = await this.getVerifyAttempts(userId);
      if (attempts >= this.config.maxVerifyAttempts) {
        throw new Error('Too many verification attempts');
      }

      // Get user's 2FA data
      const { data: twoFactorData } = await supabase
        .from('user_2fa')
        .select('secret, backup_codes')
        .eq('user_id', userId)
        .single();

      if (!twoFactorData) {
        throw new Error('2FA not enabled');
      }

      // Check if it's a backup code
      if (twoFactorData.backup_codes.includes(token)) {
        await this.useBackupCode(userId, token);
        return true;
      }

      // Verify TOTP token
      const secret = this.decrypt(twoFactorData.secret);
      const isValid = authenticator.verify({
        token,
        secret
      });

      if (!isValid) {
        await this.incrementVerifyAttempts(userId);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('2FA token verification failed', error as Error);
      return false;
    }
  }

  private async generateBackupCodes(userId: string): Promise<string[]> {
    const codes = [];
    for (let i = 0; i < this.config.backupCodesCount; i++) {
      codes.push(createHash('sha256')
        .update(`${userId}-${Date.now()}-${Math.random()}`)
        .digest('hex')
        .substring(0, 10)
      );
    }
    return codes;
  }

  private async useBackupCode(userId: string, code: string): Promise<void> {
    await supabase.rpc('remove_backup_code', {
      p_user_id: userId,
      p_code: code
    });
  }

  private async getVerifyAttempts(userId: string): Promise<number> {
    const attempts = await this.redis.get(`2fa_attempts:${userId}`);
    return parseInt(attempts || '0');
  }

  private async incrementVerifyAttempts(userId: string): Promise<void> {
    await this.redis.incr(`2fa_attempts:${userId}`);
    await this.redis.expire(`2fa_attempts:${userId}`, 300); // 5 minutes
  }

  private encrypt(text: string): string {
    // Implement encryption using your preferred method
    return text; // TODO: Add proper encryption
  }

  private decrypt(text: string): string {
    // Implement decryption using your preferred method
    return text; // TODO: Add proper decryption
  }
}
