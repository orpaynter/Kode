import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sebkzfhpsgjzztidlsnr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYmt6Zmhwc2dqenp0aWRsc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDMxMzMsImV4cCI6MjA2NzMxOTEzM30.h6fxjQkjFPXgCmIhr7_7LAaWrxGyqYZlY7Ope2b0RGg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Database types
export interface Profile {
  id: string
  user_id: string
  email: string
  full_name?: string
  company?: string
  phone?: string
  user_role: string
  license_type: string
  license_expires_at?: string
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  property_address?: string
  status: string
  total_value?: number
  progress_percentage?: number
  created_at?: string
  updated_at?: string
}

export interface ReferralData {
  id: string
  referrer_id: string
  referee_email: string
  referee_name?: string
  status: string
  commission_amount?: number
  commission_paid?: boolean
  completed_at?: string
  created_at?: string
}

export interface AnalyticsData {
  id: string
  metric_name: string
  metric_value: number
  metric_type: string
  period_start: string
  period_end: string
  metadata?: any
  created_at?: string
}

export interface AnalyticsEvent {
  id: string
  user_id?: string
  event_type: string
  event_data?: any
  ip_address?: string
  user_agent?: string
  created_at?: string
}

// Public/Lead Gen Types
export interface Lead {
  id: string
  contact_name: string
  contact_email: string
  contact_phone: string
  property_address: string
  city: string
  state: string
  zip_code: string
  property_type: 'residential' | 'commercial'
  damage_type: string
  damage_severity: 'minor' | 'moderate' | 'severe' | 'emergency'
  damage_description: string
  urgency_level: number
  has_insurance: boolean
  insurance_company?: string
  claim_filed?: boolean
  is_decision_maker: boolean
  budget_range?: string
  roof_age?: number
  roof_material?: string
  square_footage?: number
  timeline?: string
  notes?: string
  lead_score: number
  qualification_status: 'new' | 'qualified' | 'hot' | 'converted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface DamageAssessment {
  id: string
  lead_id: string
  photo_url: string
  ai_analysis_result: any
  damage_types: string[]
  confidence_score: number
  estimated_cost_min: number
  estimated_cost_max: number
  insurance_claim_probability: number
  priority_level: 'low' | 'medium' | 'high' | 'emergency'
  analysis_status: 'processing' | 'completed' | 'failed'
  processing_time_seconds: number
  created_at: string
}

export interface Contractor {
  id: string
  business_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  state: string
  zip_code: string
  service_radius: number
  specialties: string[]
  is_verified: boolean
  is_active: boolean
  license_number: string
  insurance_verified: boolean
  background_checked: boolean
  rating: number
  total_jobs: number
  response_time_hours: number
  availability_status: 'available' | 'busy' | 'unavailable'
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  lead_id?: string
  session_data: any
  user_type: 'homeowner' | 'contractor' | 'insurance_professional'
  qualification_stage: string
  is_emergency: boolean
  callback_requested: boolean
  session_status: 'active' | 'completed' | 'abandoned'
  created_at: string
  updated_at: string
}
