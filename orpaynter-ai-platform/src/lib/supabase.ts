import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'homeowner' | 'contractor' | 'insurance' | 'supplier' | 'admin'
          address: string | null
          avatar_url: string | null
          subscription_tier: 'basic' | 'professional' | 'enterprise'
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          stripe_customer_id: string | null
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'homeowner' | 'contractor' | 'insurance' | 'supplier' | 'admin'
          address?: string | null
          avatar_url?: string | null
          subscription_tier?: 'basic' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          stripe_customer_id?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'homeowner' | 'contractor' | 'insurance' | 'supplier' | 'admin'
          address?: string | null
          avatar_url?: string | null
          subscription_tier?: 'basic' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          stripe_customer_id?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          property_address: string
          assessment_type: 'roof' | 'siding' | 'windows' | 'general'
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          photos: string[]
          ai_analysis: any
          damage_severity: 'low' | 'medium' | 'high' | 'critical'
          estimated_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_address: string
          assessment_type: 'roof' | 'siding' | 'windows' | 'general'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          photos?: string[]
          ai_analysis?: any
          damage_severity?: 'low' | 'medium' | 'high' | 'critical'
          estimated_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_address?: string
          assessment_type?: 'roof' | 'siding' | 'windows' | 'general'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          photos?: string[]
          ai_analysis?: any
          damage_severity?: 'low' | 'medium' | 'high' | 'critical'
          estimated_cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          assessment_id: string | null
          title: string
          description: string | null
          status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high'
          estimated_cost: number | null
          actual_cost: number | null
          start_date: string | null
          end_date: string | null
          contractor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_id?: string | null
          title: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high'
          estimated_cost?: number | null
          actual_cost?: number | null
          start_date?: string | null
          end_date?: string | null
          contractor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_id?: string | null
          title?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high'
          estimated_cost?: number | null
          actual_cost?: number | null
          start_date?: string | null
          end_date?: string | null
          contractor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]