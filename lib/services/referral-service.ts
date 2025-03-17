import type { ReferralCode, ReferralStats } from '@/types/referral';
import { nanoid } from 'nanoid';
import { ErrorHandler } from '../error/error-handler';
import { supabase } from '../supabase';

export class ReferralService {
  constructor(
    private errorHandler = new ErrorHandler()
  ) {}

  async createReferralCode(userId: string): Promise<ReferralCode> {
    try {
      const code = nanoid(8).toUpperCase();
      
      const { data, error } = await supabase
        .from('referral_codes')
        .insert({
          code,
          user_id: userId,
          created_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        code: data.code,
        userId: data.user_id,
        createdAt: data.created_at,
        status: data.status
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'referral.createCode',
        userId
      });
      throw error;
    }
  }

  async validateReferralCode(code: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('status')
        .eq('code', code.toUpperCase())
        .single();

      if (error) throw error;

      return data?.status === 'active';
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'referral.validateCode',
        code
      });
      throw error;
    }
  }

  async trackReferral(code: string, referredUserId: string): Promise<void> {
    try {
      const { data: referralCode, error: referralError } = await supabase
        .from('referral_codes')
        .select('user_id')
        .eq('code', code.toUpperCase())
        .single();

      if (referralError) throw referralError;

      const { error: trackingError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referralCode.user_id,
          referred_id: referredUserId,
          code,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (trackingError) throw trackingError;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'referral.trackReferral',
        code,
        referredUserId
      });
      throw error;
    }
  }

  async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      // Get all referrals for the user
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select(`
          id,
          referred_id,
          status,
          created_at,
          reward_amount,
          users!referred_id (
            name,
            avatar_url
          )
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      // Get daily stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyStats: Record<string, { referrals: number; conversions: number }> = {};
      const today = new Date();

      for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dailyStats[dateStr] = { referrals: 0, conversions: 0 };
      }

      let totalReferrals = 0;
      let totalConversions = 0;
      let totalEarnings = 0;

      referrals.forEach(referral => {
        const dateStr = new Date(referral.created_at).toISOString().split('T')[0];
        
        if (dailyStats[dateStr]) {
          dailyStats[dateStr].referrals++;
          if (referral.status === 'converted') {
            dailyStats[dateStr].conversions++;
            totalConversions++;
            totalEarnings += referral.reward_amount || 0;
          }
        }
        
        totalReferrals++;
      });

      const recentReferrals = referrals.slice(0, 5).map(referral => ({
        id: referral.id,
        referredUser: referral.users.name || 'Anonymous',
        status: referral.status,
        date: referral.created_at,
        reward: referral.reward_amount
      }));

      return {
        totalReferrals,
        totalConversions,
        totalEarnings,
        dailyStats,
        recentReferrals
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'referral.getStats',
        userId
      });
      throw error;
    }
  }

  async updateReferralStatus(
    referralId: string,
    status: 'converted' | 'cancelled',
    rewardAmount?: number
  ): Promise<void> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (rewardAmount !== undefined) {
        updates.reward_amount = rewardAmount;
      }

      const { error } = await supabase
        .from('referrals')
        .update(updates)
        .eq('id', referralId);

      if (error) throw error;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'referral.updateStatus',
        referralId,
        status,
        rewardAmount
      });
      throw error;
    }
  }
}
