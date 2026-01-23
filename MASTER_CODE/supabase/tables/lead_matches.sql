CREATE TABLE lead_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL,
    contractor_id UUID,
    match_score INTEGER,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending',
    'contacted',
    'converted',
    'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);