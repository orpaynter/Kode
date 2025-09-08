import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
type UserRole = 'homeowner' | 'contractor' | 'insurance' | 'supplier';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  requiresAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  roles, 
  requiresAuth = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles && user && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for role-based route protection
export function withRoleProtection(roles: UserRole[]) {
  return function (Component: React.ComponentType) {
    return function ProtectedComponent(props: any) {
      return (
        <ProtectedRoute roles={roles}>
          <Component {...props} />
        </ProtectedRoute>
      );
    };
  };
}

// Specific role protection components
export const HomeownerRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute roles={['homeowner']}>{children}</ProtectedRoute>
);

export const ContractorRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute roles={['contractor']}>{children}</ProtectedRoute>
);

export const InsuranceRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute roles={['insurance']}>{children}</ProtectedRoute>
);

export const SupplierRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute roles={['supplier']}>{children}</ProtectedRoute>
);

// Multi-role protection
export const BusinessRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute roles={['contractor', 'insurance', 'supplier']}>
    {children}
  </ProtectedRoute>
);