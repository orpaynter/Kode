import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export function AuthCallback() {
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        
        if (type === 'signup' && accessToken && refreshToken) {
          // For signup confirmation
          setMessage('Confirming your email...')
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Session setting error:', error)
            setStatus('error')
            setMessage(`Authentication failed: ${error.message}`)
            setTimeout(() => navigate('/login'), 3000)
            return
          }
          
          if (data.session?.user) {
            // Create profile if it doesn't exist
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                user_id: data.session.user.id,
                email: data.session.user.email!,
                full_name: data.session.user.user_metadata.full_name || '',
                company: data.session.user.user_metadata.company || '',
                phone: data.session.user.user_metadata.phone || '',
                user_role: data.session.user.user_metadata.user_role || 'property_owner',
                license_type: data.session.user.user_metadata.license_type || 'basic',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              
            if (profileError) {
              console.error('Profile creation error:', profileError)
              // Don't fail the auth process for profile creation issues
            }
            
            await refreshSession()
            setStatus('success')
            setMessage('Email confirmed successfully! Redirecting to dashboard...')
            setTimeout(() => navigate('/dashboard'), 2000)
          }
        } else {
          // Handle other auth callback scenarios
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            setStatus('error')
            setMessage(`Authentication error: ${error.message}`)
            setTimeout(() => navigate('/login'), 3000)
            return
          }
          
          if (data.session) {
            await refreshSession()
            setStatus('success')
            setMessage('Successfully authenticated! Redirecting...')
            setTimeout(() => navigate('/dashboard'), 2000)
          } else {
            setStatus('error')
            setMessage('No authentication session found')
            setTimeout(() => navigate('/login'), 3000)
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Authentication failed')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate, refreshSession])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          )}
          {status === 'success' && (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-4">Authentication</h2>
        <p className="text-gray-300">{message}</p>
        
        {status === 'error' && (
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}