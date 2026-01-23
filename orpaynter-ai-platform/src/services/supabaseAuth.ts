import { supabase } from '../lib/supabase'
import type { User } from '../hooks/useAuth'

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone: string
  role: 'homeowner' | 'contractor' | 'insurance' | 'supplier'
}

export interface LoginResponse {
  user: User
  token: string
}

class SupabaseAuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Login failed')
    }

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      // If profile doesn't exist, create one
      const newProfile = {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name || '',
        phone: data.user.user_metadata?.phone || '',
        role: data.user.user_metadata?.role || 'homeowner',
        email_verified: data.user.email_confirmed_at !== null,
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single()

      if (createError) {
        throw new Error('Failed to create user profile')
      }

      const user: User = {
        id: createdProfile.id,
        email: createdProfile.email,
        full_name: createdProfile.full_name,
        phone: createdProfile.phone,
        role: createdProfile.role,
        email_verified: createdProfile.email_verified,
        created_at: createdProfile.created_at,
        updated_at: createdProfile.updated_at,
      }

      return {
        user,
        token: data.session?.access_token || '',
      }
    }

    const user: User = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.role,
      email_verified: profile.email_verified,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }

    return {
      user,
      token: data.session?.access_token || '',
    }
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    const { email, password, full_name, phone, role } = userData

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          role,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Registration failed')
    }

    // Create user profile in users table
    const userProfile = {
      id: data.user.id,
      email: data.user.email!,
      full_name,
      phone,
      role,
      email_verified: data.user.email_confirmed_at !== null,
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert(userProfile)
      .select()
      .single()

    if (profileError) {
      // If user creation fails, clean up auth user
      await supabase.auth.signOut()
      throw new Error('Failed to create user profile')
    }

    const user: User = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.role,
      email_verified: profile.email_verified,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }

    return {
      user,
      token: data.session?.access_token || '',
    }
  }

  async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      throw new Error('No authenticated user')
    }

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw new Error('Failed to fetch user profile')
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.role,
      email_verified: profile.email_verified,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update({
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error('Failed to update profile')
    }

    return {
      id: updatedProfile.id,
      email: updatedProfile.email,
      full_name: updatedProfile.full_name,
      phone: updatedProfile.phone,
      role: updatedProfile.role,
      email_verified: updatedProfile.email_verified,
      created_at: updatedProfile.created_at,
      updated_at: updatedProfile.updated_at,
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Failed to sign out')
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const user = await this.getCurrentUser()
          callback(user)
        } catch (error) {
          console.error('Error getting current user:', error)
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }
}

export const supabaseAuthService = new SupabaseAuthService()