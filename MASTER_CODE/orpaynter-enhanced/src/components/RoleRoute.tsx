import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface RoleRouteProps {
  children: ReactNode
  allowedRoles: string[]
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile || !allowedRoles.includes(profile.user_role)) {
    // Redirect to appropriate dashboard based on actual role
    if (profile?.user_role === 'contractor') return <Navigate to="/dashboard" replace />
    if (profile?.user_role === 'homeowner') return <Navigate to="/homeowner/dashboard" replace />
    if (profile?.user_role === 'supplier') return <Navigate to="/supplier/dashboard" replace />
    if (profile?.user_role === 'insurance') return <Navigate to="/insurance/dashboard" replace />
    
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
