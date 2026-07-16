CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  converted_from_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  assigned_to TEXT,
  estimated_value DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  expected_close_date TIMESTAMPTZ,
  win_probability INTEGER DEFAULT 0 CHECK (win_probability >= 0 AND win_probability <= 100),
  stage TEXT NOT NULL DEFAULT 'discovery' CHECK (stage IN ('discovery','qualification','proposal','negotiation','closed_won','closed_lost')),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  lost_reason TEXT,
  won_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned_to ON opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_opportunities_deleted_at ON opportunities(deleted_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON opportunities(customer_id);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on opportunities"
  ON opportunities FOR ALL
  USING (true);

CREATE OR REPLACE FUNCTION handle_opportunity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_opportunity_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION handle_opportunity_updated_at();
