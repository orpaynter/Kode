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