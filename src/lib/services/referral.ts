import { supabase } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';

export class ReferralService {
  async generateReferralCode(userId: string) {
    const code = nanoid(8);
    
    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        user_id: userId,
        code
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async applyReferralCode(code: string, userId: string) {
    // Verify code exists and hasn't been used by this user
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id')
      .eq('code', code)
      .single();

    if (codeError || !referralCode) {
      throw new Error('Invalid referral code');
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referralCode.user_id,
        referred_id: userId,
        code
      });

    if (referralError) throw referralError;

    // Update referral count
    await supabase.rpc('increment_referral_count', { code });
  }

  async getReferralStats(userId: string) {
    const { data, error } = await supabase
      .from('referral_codes')
      .select(`
        code,
        total_referrals,
        rewards_config,
        referrals (
          status,
          reward_claimed,
          referred:referred_id (
            id,
            email
          )
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}

export const referralService = new ReferralService();
