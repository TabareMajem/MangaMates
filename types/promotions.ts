export interface PromotionCode {
  id: string;
  code: string;
  active: boolean;
  couponId: string;
  customerId?: string;
  maxRedemptions?: number;
  timesRedeemed: number;
  expiresAt?: Date;
  metadata: {
    referrerId?: string;
    campaignId?: string;
    type?: 'referral' | 'affiliate' | 'promotion';
  };
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
}

export interface ReferralData {
  code: string | null;
  stats: ReferralStats;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'referral' | 'campaign';
  discount: number;
  expiresAt?: string;
  metadata?: Record<string, any>;
}
