import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { LoginPage } from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { AuthCallback } from './pages/auth/AuthCallback'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { CommandCenter } from './pages/CommandCenter'
import { Projects } from './pages/Projects'
import { Analytics } from './pages/Analytics'
import { Referrals } from './pages/Referrals'
import { AIAgents } from './pages/AIAgents'
import { Billing } from './pages/Billing'
import { Settings } from './pages/Settings'
import { ErrorBoundary } from './components/ErrorBoundary'

// Public / Landing Pages
import LandingPage from './pages/public/LandingPage'
import ChatbotFlow from './pages/public/ChatbotFlow'
import DamageAssessment from './pages/public/DamageAssessment'
import ResultsDashboard from './pages/public/ResultsDashboard'

// Role-Specific Dashboards
import SupplierDashboard from './pages/supplier/SupplierDashboard'
import InsuranceDashboard from './pages/insurance/InsuranceDashboard'
import HomeownerDashboard from './pages/homeowner/HomeownerDashboard'

// Admin Pages
import LeadAdminLogin from './pages/admin/LeadAdminLogin'
import LeadAdminDashboard from './pages/admin/LeadAdminDashboard'

import './globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-slate-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/chatbot" element={<ChatbotFlow />} />
                <Route path="/assessment" element={<DamageAssessment />} />
                <Route path="/results/:leadId" element={<ResultsDashboard />} />

                {/* Lead Admin Routes */}
                <Route path="/admin/login" element={<LeadAdminLogin />} />
                <Route path="/admin/dashboard" element={<LeadAdminDashboard />} />

                {/* Auth routes for App */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Contractor Routes (Default Dashboard) */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleRoute allowedRoles={['contractor', 'admin']}>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/command-center"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CommandCenter />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <RoleRoute allowedRoles={['contractor', 'admin']}>
                      <DashboardLayout>
                        <Projects />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <RoleRoute allowedRoles={['contractor', 'admin']}>
                      <DashboardLayout>
                        <Analytics />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/referrals"
                  element={
                    <RoleRoute allowedRoles={['contractor', 'admin']}>
                      <DashboardLayout>
                        <Referrals />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/ai-agents"
                  element={
                    <RoleRoute allowedRoles={['contractor', 'admin']}>
                      <DashboardLayout>
                        <AIAgents />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/billing"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Billing />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Settings />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Other Role Dashboards */}
                <Route
                  path="/supplier/dashboard"
                  element={
                    <RoleRoute allowedRoles={['supplier', 'admin']}>
                      <DashboardLayout>
                        <SupplierDashboard />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/insurance/dashboard"
                  element={
                    <RoleRoute allowedRoles={['insurance', 'admin']}>
                      <DashboardLayout>
                        <InsuranceDashboard />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                <Route
                  path="/homeowner/dashboard"
                  element={
                    <RoleRoute allowedRoles={['homeowner', 'admin']}>
                      <DashboardLayout>
                        <HomeownerDashboard />
                      </DashboardLayout>
                    </RoleRoute>
                  }
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #475569',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
