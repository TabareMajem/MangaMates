import type { ReferralStats } from '@/types/promotions';
import { supabase } from '../supabase';

export async function calculateReferralStats(userId: string): Promise<ReferralStats> {
  const { data: referrals } = await supabase
    .from('customer_discounts')
    .select(`
      *,
      promotion_codes!inner (
        metadata
      )
    `)
    .eq('promotion_codes.metadata->referrerId', userId);

  const totalReferrals = referrals?.length || 0;
  const activeReferrals = referrals?.filter(r => !r.end || new Date(r.end) > new Date()).length || 0;
  
  // Calculate earnings (10% of referred user's payments)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status')
    .in('customer_id', referrals?.map(r => r.customer_id) || []);

  const totalEarnings = (payments || [])
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + (p.amount * 0.1), 0);

  const pendingEarnings = (payments || [])
    .filter(p => p.status === 'processing')
    .reduce((sum, p) => sum + (p.amount * 0.1), 0);

  const conversionRate = totalReferrals ? (activeReferrals / totalReferrals) * 100 : 0;

  return {
    totalReferrals,
    activeReferrals,
    totalEarnings: totalEarnings / 100, // Convert from cents
    pendingEarnings: pendingEarnings / 100,
    conversionRate
  };
}
