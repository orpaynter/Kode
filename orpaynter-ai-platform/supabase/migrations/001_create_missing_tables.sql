-- OrPaynter AI Platform - Database Schema Setup
-- This migration creates missing tables and updates existing ones to match the architecture

-- First, check if users table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE public.users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            role VARCHAR(20) NOT NULL CHECK (role IN ('homeowner', 'contractor', 'insurance', 'supplier')),
            profile_data JSONB DEFAULT '{}',
            email_verified BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create assessments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'assessments') THEN
        CREATE TABLE public.assessments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            property_address TEXT NOT NULL,
            images_metadata JSONB DEFAULT '[]',
            notes TEXT,
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END
$$;

-- Create AI reports table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_reports') THEN
        CREATE TABLE public.ai_reports (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
            damage_analysis JSONB NOT NULL,
            confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
            recommendations JSONB DEFAULT '[]',
            summary TEXT,
            generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Update existing projects table or create if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        CREATE TABLE public.projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            assessment_id UUID REFERENCES public.assessments(id),
            title VARCHAR(200) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')),
            estimated_cost DECIMAL(12,2),
            start_date DATE,
            completion_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns to existing projects table
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'assessment_id') THEN
            ALTER TABLE public.projects ADD COLUMN assessment_id UUID REFERENCES public.assessments(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'estimated_cost') THEN
            ALTER TABLE public.projects ADD COLUMN estimated_cost DECIMAL(12,2);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'start_date') THEN
            ALTER TABLE public.projects ADD COLUMN start_date DATE;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'completion_date') THEN
            ALTER TABLE public.projects ADD COLUMN completion_date DATE;
        END IF;
    END IF;
END
$$;

-- Create project tasks table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_tasks') THEN
        CREATE TABLE public.project_tasks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
            assigned_to UUID REFERENCES public.users(id),
            due_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create cost estimates table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cost_estimates') THEN
        CREATE TABLE public.cost_estimates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
            materials JSONB DEFAULT '[]',
            labor JSONB DEFAULT '[]',
            total_amount DECIMAL(12,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Update existing subscriptions table or create if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
        CREATE TABLE public.subscriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('starter', 'pro', 'enterprise')),
            billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
            amount DECIMAL(10,2) NOT NULL,
            stripe_subscription_id VARCHAR(255) UNIQUE,
            status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
            current_period_start TIMESTAMP WITH TIME ZONE,
            current_period_end TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns to existing subscriptions table
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'plan_type') THEN
            ALTER TABLE public.subscriptions ADD COLUMN plan_type VARCHAR(50) CHECK (plan_type IN ('starter', 'pro', 'enterprise'));
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'billing_cycle') THEN
            ALTER TABLE public.subscriptions ADD COLUMN billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'annual'));
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'amount') THEN
            ALTER TABLE public.subscriptions ADD COLUMN amount DECIMAL(10,2);
        END IF;
    END IF;
END
$$;

-- Update existing leads table or create if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN
        CREATE TABLE public.leads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contractor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            assessment_id UUID REFERENCES public.assessments(id),
            status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_contact TIMESTAMP WITH TIME ZONE
        );
    ELSE
        -- Add missing columns to existing leads table
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'contractor_id') THEN
            ALTER TABLE public.leads ADD COLUMN contractor_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'assessment_id') THEN
            ALTER TABLE public.leads ADD COLUMN assessment_id UUID REFERENCES public.assessments(id);
        END IF;
    END IF;
END
$$;

-- Create insurance claims table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'insurance_claims') THEN
        CREATE TABLE public.insurance_claims (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            assessment_id UUID REFERENCES public.assessments(id),
            claim_number VARCHAR(100) UNIQUE,
            status VARCHAR(50) DEFAULT 'filed' CHECK (status IN ('filed', 'under_review', 'approved', 'denied', 'paid')),
            claim_amount DECIMAL(12,2),
            filed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create fraud alerts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fraud_alerts') THEN
        CREATE TABLE public.fraud_alerts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            claim_id UUID REFERENCES public.insurance_claims(id) ON DELETE CASCADE,
            alert_type VARCHAR(100) NOT NULL,
            risk_score DECIMAL(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
            analysis_data JSONB DEFAULT '{}',
            status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'reviewed', 'dismissed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create support tickets table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
        CREATE TABLE public.support_tickets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            subject VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
            status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            resolved_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END
$$;

-- Create subscription plans reference table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
        CREATE TABLE public.subscription_plans (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) NOT NULL UNIQUE,
            price_monthly DECIMAL(10,2) NOT NULL,
            price_annual DECIMAL(10,2) NOT NULL,
            features JSONB DEFAULT '[]',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_ai_reports_assessment ON public.ai_reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_project ON public.cost_estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_leads_contractor ON public.leads(contractor_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_user ON public.insurance_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_claim ON public.fraud_alerts(claim_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);

-- Insert initial subscription plans data
INSERT INTO public.subscription_plans (name, price_monthly, price_annual, features) VALUES
('starter', 29.99, 299.99, '["5 AI scans/month", "Basic reports", "Email support", "Mobile app access"]'),
('pro', 99.99, 999.99, '["Unlimited AI scans", "Advanced analytics", "Priority support", "API access", "Custom branding"]'),
('enterprise', 299.99, 2999.99, '["White-label solution", "Dedicated support", "Custom integrations", "Advanced fraud detection", "Multi-location management"]')
ON CONFLICT (name) DO NOTHING;