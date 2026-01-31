-- Enable RLS
ALTER TABLE IF EXISTS insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS claim_reviews ENABLE ROW LEVEL SECURITY;

-- Create Tables
CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policyholder_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  insurance_company_id UUID REFERENCES auth.users(id),
  policy_number TEXT,
  claim_number TEXT,
  status TEXT DEFAULT 'submitted', -- submitted, under_review, approved, rejected, payout_pending, closed
  damage_description TEXT,
  estimated_loss DECIMAL(10,2),
  approved_amount DECIMAL(10,2),
  filed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claim_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  note TEXT,
  status_change TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- Claims: Policyholders view their own. Insurance agents view assigned claims.
CREATE POLICY "Users can view relevant claims" ON insurance_claims
  FOR SELECT USING (
    auth.uid() = policyholder_id OR 
    auth.uid() = insurance_company_id OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Policyholders can file claims" ON insurance_claims
  FOR INSERT WITH CHECK (auth.uid() = policyholder_id);

CREATE POLICY "Insurance agents can update assigned claims" ON insurance_claims
  FOR UPDATE USING (auth.uid() = insurance_company_id);

-- Reviews: Viewable by relevant parties. Insertable by insurance agents.
CREATE POLICY "Users can view reviews for their claims" ON claim_reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM insurance_claims WHERE id = claim_reviews.claim_id AND (policyholder_id = auth.uid() OR insurance_company_id = auth.uid()))
  );

CREATE POLICY "Insurance agents can add reviews" ON claim_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
