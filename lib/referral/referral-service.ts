import { sendEmail } from '@/lib/email/mailer';
import { AppError, ErrorCode } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  usageCount: number;
  maxUses: number;
  expiresAt: Date | null;
  createdAt: Date;
}

export class ReferralService {
  async createReferralCode(userId: string, maxUses = 10) {
    const code = nanoid(8);
    
    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        user_id: userId,
        code,
        max_uses: maxUses,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .select()
      .single();

    if (error) {
      throw new AppError(
        'Failed to create referral code',
        ErrorCode.DATABASE_ERROR,
        500,
        error
      );
    }

    return data;
  }

  async processReferral(code: string, newUserId: string) {
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !referralCode) {
      throw new AppError('Invalid referral code', ErrorCode.AUTH_FAILED, 400);
    }

    if (referralCode.usage_count >= referralCode.max_uses) {
      throw new AppError('Referral code expired', ErrorCode.AUTH_FAILED, 400);
    }

    // Record the referral
    await supabase.from('referrals').insert({
      referrer_id: referralCode.user_id,
      referred_id: newUserId,
      code: code
    });

    // Update usage count
    await supabase
      .from('referral_codes')
      .update({ usage_count: referralCode.usage_count + 1 })
      .eq('id', referralCode.id);

    // Grant rewards to referrer
    await this.grantReferralRewards(referralCode.user_id);

    // Notify referrer
    await this.notifyReferrer(referralCode.user_id);
  }

  private async grantReferralRewards(userId: string) {
    // Add 30 days to subscription if exists
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (subscription) {
      const newEndDate = new Date(subscription.current_period_end);
      newEndDate.setDate(newEndDate.getDate() + 30);

      await supabase
        .from('subscriptions')
        .update({ current_period_end: newEndDate })
        .eq('user_id', userId);
    }

    // Add reward credits
    await supabase.rpc('increment_user_credits', {
      user_id: userId,
      amount: 1000 // $10.00 worth of credits
    });
  }

  private async notifyReferrer(userId: string) {
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (user?.email) {
      await sendEmail({
        to: user.email,
        template: 'referral-success',
        data: {
          rewardAmount: '$10.00',
          subscriptionDays: 30
        }
      });
    }
  }
}
