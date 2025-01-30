/*
  # Referral System Schema
  
  1. New Tables
    - referral_codes: Store user referral codes
    - referrals: Track referral relationships
    - referral_rewards: Track rewards given
*/

-- Create referral_codes table
CREATE TABLE referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  usage_count integer DEFAULT 0,
  max_uses integer NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text REFERENCES referral_codes(code),
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create referral_rewards table
CREATE TABLE referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid REFERENCES referrals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('subscription_extension', 'credits')),
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Referral codes policies
CREATE POLICY "Users can view own referral codes"
  ON referral_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own referral codes"
  ON referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Referrals policies
CREATE POLICY "Users can view referrals they're involved in"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Rewards policies
CREATE POLICY "Users can view own rewards"
  ON referral_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referral_rewards_user ON referral_rewards(user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
