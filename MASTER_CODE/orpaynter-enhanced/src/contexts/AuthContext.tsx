import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user and profile on mount
  useEffect(() => {
    async function loadUserAndProfile() {
      setLoading(true)
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setUser(null)
          setProfile(null)
          setSession(null)
          return
        }

        setSession(currentSession)
        
        if (currentSession?.user) {
          setUser(currentSession.user)
          // Give a small delay to ensure profile creation trigger has completed
          setTimeout(async () => {
            await loadUserProfile(currentSession.user.id)
          }, 100)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        const authError = error as AuthError
        // Suppress "Auth session missing" error as it is expected for unauthenticated users
        if (authError.message === 'Auth session missing!' || authError.name === 'AuthSessionMissingError') {
          console.debug('No active session found (Guest user)')
        } else {
          console.error('Error loading user:', error)
        }
        setUser(null)
        setProfile(null)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserAndProfile()

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user && event === 'SIGNED_IN') {
          // Load profile for new user session, with a small delay for database consistency
          setTimeout(() => {
            loadUserProfile(session.user.id).catch(console.error)
          }, 100)
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error loading profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      if (data.user) {
        toast.success('Successfully signed in!')
      }
      
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Sign in failed')
      return { error: authError }
    }
  }

  async function signUp(email: string, password: string, userData: any = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      if (data.user) {
        // If email confirmation is disabled, the user might be immediately confirmed
        if (data.user.email_confirmed_at) {
          toast.success('Account created successfully!')
          // Profile should be created automatically by database trigger
        } else {
          toast.success('Account created! Please check your email to verify your account.')
        }
      }
      
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Sign up failed')
      return { error: authError }
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
        return
      }
      
      setUser(null)
      setProfile(null)
      setSession(null)
      toast.success('Successfully signed out')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    try {
      // Verify current user identity
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !currentUser) {
        throw new Error('User authentication failed, please login again')
      }
      
      // Update user profile
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', currentUser.id)
        .select()
        .maybeSingle()
      
      if (error) {
        console.error('Database update error:', error)
        throw error
      }
      
      if (data) {
        setProfile(data)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  async function refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Session refresh error:', error)
        return
      }
      
      setSession(data.session)
      setUser(data.session?.user || null)
      
      if (data.session?.user) {
        await loadUserProfile(data.session.user.id)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}