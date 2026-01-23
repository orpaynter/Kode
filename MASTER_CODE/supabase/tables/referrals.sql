CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL,
    referee_email VARCHAR(255) NOT NULL,
    referee_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    commission_amount DECIMAL(8,2) DEFAULT 0,
    commission_paid BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);