import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { StripeProvider } from './contexts/StripeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { AssessmentForm } from './pages/AssessmentForm';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { HomeownerDashboard } from './pages/HomeownerDashboard';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { InsuranceDashboard } from './pages/InsuranceDashboard';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NewProjectPage } from './pages/NewProjectPage';
import PricingPage from './pages/PricingPage';
import BillingPage from './pages/BillingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentErrorPage from './pages/PaymentErrorPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TestPage } from './pages/TestPage';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <Router>
          <div className="min-h-screen bg-dark-primary text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/assessment" element={<AssessmentForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout>
                  <ProjectsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetailPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects/new" element={
              <ProtectedRoute>
                <Layout>
                  <NewProjectPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Payment Routes */}
            <Route path="/pricing" element={<PricingPage />} />
            
            <Route path="/billing" element={
              <ProtectedRoute>
                <Layout>
                  <BillingPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/error" element={<PaymentErrorPage />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/support" element={
              <ProtectedRoute>
                <Layout>
                  <SupportPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Coming Soon Routes */}
            <Route path="/analytics" element={<ComingSoonPage feature="Advanced Analytics" />} />
            <Route path="/reports" element={<ComingSoonPage feature="Custom Reports" />} />
            <Route path="/integrations" element={<ComingSoonPage feature="Third-party Integrations" />} />
            
            {/* Test Route */}
            <Route path="/test" element={<TestPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </div>
        </Router>
      </StripeProvider>
    </AuthProvider>
  );
}

// Dashboard Router Component
function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'homeowner':
      return <HomeownerDashboard />;
    case 'contractor':
      return <ContractorDashboard />;
    case 'insurance':
      return <InsuranceDashboard />;
    case 'supplier':
      return <SupplierDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default App;