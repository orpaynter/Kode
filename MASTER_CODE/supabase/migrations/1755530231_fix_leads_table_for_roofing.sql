-- Migration: fix_leads_table_for_roofing
-- Created at: 1755530231

-- Drop the existing leads table and create the correct one for roofing
DROP TABLE IF EXISTS leads;

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    property_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    property_type VARCHAR(20) CHECK (property_type IN ('residential', 'commercial')) NOT NULL,
    damage_type VARCHAR(100) NOT NULL,
    damage_severity VARCHAR(20) CHECK (damage_severity IN ('minor', 'moderate', 'severe', 'emergency')) NOT NULL,
    damage_description TEXT NOT NULL,
    urgency_level INTEGER NOT NULL CHECK (urgency_level >= 1 AND urgency_level <= 10),
    has_insurance BOOLEAN NOT NULL,
    insurance_company VARCHAR(100),
    claim_filed BOOLEAN,
    is_decision_maker BOOLEAN NOT NULL,
    budget_range VARCHAR(50),
    roof_age INTEGER,
    roof_material VARCHAR(50),
    square_footage INTEGER,
    timeline VARCHAR(100),
    notes TEXT,
    lead_score INTEGER DEFAULT 0,
    qualification_status VARCHAR(20) DEFAULT 'new' CHECK (qualification_status IN ('new', 'qualified', 'hot', 'converted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);;