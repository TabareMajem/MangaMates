/*
  # Referral and Affiliate System

  1. New Tables
    - `referral_codes`: Stores user referral codes
    - `referrals`: Tracks referral relationships
    - `affiliate_partners`: Stores affiliate partner info
    - `affiliate_commissions`: Tracks commission payouts
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Referral Codes
CREATE TABLE referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  rewards_config jsonb NOT NULL DEFAULT '{"signup_bonus": 1000, "referral_bonus": 500}',
  total_referrals integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Referrals
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text REFERENCES referral_codes(code),
  status text NOT NULL DEFAULT 'pending',
  reward_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referred_id)
);

-- Affiliate Partners
CREATE TABLE affiliate_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  website text,
  commission_rate numeric NOT NULL DEFAULT 0.1,
  payment_info jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Affiliate Commissions
CREATE TABLE affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES affiliate_partners(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own referral codes"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read referrals they're involved in"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Partners can read own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT id FROM affiliate_partners WHERE user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(code);
CREATE INDEX idx_affiliate_partners_user ON affiliate_partners(user_id);
CREATE INDEX idx_affiliate_commissions_partner ON affiliate_commissions(partner_id);
