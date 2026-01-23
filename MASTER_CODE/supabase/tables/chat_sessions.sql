CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID,
    session_data JSONB,
    user_type VARCHAR(20) CHECK (user_type IN ('homeowner',
    'contractor',
    'insurance_professional')),
    qualification_stage VARCHAR(50),
    is_emergency BOOLEAN DEFAULT FALSE,
    callback_requested BOOLEAN DEFAULT FALSE,
    session_status VARCHAR(20) DEFAULT 'active' CHECK (session_status IN ('active',
    'completed',
    'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);