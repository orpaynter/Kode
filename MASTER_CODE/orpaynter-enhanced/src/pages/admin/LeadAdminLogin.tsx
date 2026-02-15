import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

const LeadAdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { email, password }
      })

      if (error) {
        throw error
      }

      const { token, user } = data.data
      
      // Store auth data
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
      
      toast.success(`Welcome back, ${user.full_name}!`)
      navigate('/admin/dashboard')
      
    } catch (error: any) {
      console.error('Admin login error:', error)
      toast.error(error.message || 'Invalid admin credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">OrPaynter Admin</h1>
            <p className="text-gray-600 mt-2">Secure admin portal access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Oliver@orpaynter.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</p>
              <p className="text-sm text-blue-700">Email: Oliver@orpaynter.com</p>
              <p className="text-sm text-blue-700">Password: Admin</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Secure admin access to manage leads and system analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadAdminLogin
