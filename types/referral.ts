export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface ReferralStats {
  totalReferrals: number;
  totalConversions: number;
  totalEarnings: number;
  dailyStats: Record<string, {
    referrals: number;
    conversions: number;
  }>;
  recentReferrals: Array<{
    id: string;
    referredUser: string;
    status: 'pending' | 'converted' | 'cancelled';
    date: string;
    reward?: number;
  }>;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  currency: string;
  maxRewards: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'expired';
}
