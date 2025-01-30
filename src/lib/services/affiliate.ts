import { supabase } from '@/lib/supabase/client';

export class AffiliateService {
  async applyForProgram(userId: string, applicationData: {
    companyName: string;
    website: string;
    paymentInfo: any;
  }) {
    const { data, error } = await supabase
      .from('affiliate_partners')
      .insert({
        user_id: userId,
        company_name: applicationData.companyName,
        website: applicationData.website,
        payment_info: applicationData.paymentInfo
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPartnerStats(userId: string) {
    const { data, error } = await supabase
      .from('affiliate_partners')
      .select(`
        *,
        commissions:affiliate_commissions (
          amount,
          status,
          paid_at
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async getCommissionHistory(partnerId: string) {
    const { data, error } = await supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const affiliateService = new AffiliateService();
