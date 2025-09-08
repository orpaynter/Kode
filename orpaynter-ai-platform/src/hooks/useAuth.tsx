import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'homeowner' | 'contractor' | 'insurance' | 'supplier';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'homeowner' | 'contractor' | 'insurance' | 'supplier';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const user = await authService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await authService.login(email, password);
      
      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await authService.register(userData);
      
      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('No user logged in');
      
      const updatedUser = await authService.updateProfile(authState.user.id, data);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock auth service for development
const mockAuthService = {
  async login(email: string, password: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    const mockUser: User = {
      id: '1',
      email,
      full_name: 'John Doe',
      phone: '+1234567890',
      role: email.includes('contractor') ? 'contractor' : 
            email.includes('insurance') ? 'insurance' :
            email.includes('supplier') ? 'supplier' : 'homeowner',
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return {
      user: mockUser,
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async register(userData: RegisterData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      email_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return {
      user: mockUser,
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async getCurrentUser(): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock user from token
    return {
      id: '1',
      email: 'user@example.com',
      full_name: 'John Doe',
      phone: '+1234567890',
      role: 'homeowner',
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return updated mock user
    return {
      id: userId,
      email: data.email || 'user@example.com',
      full_name: data.full_name || 'John Doe',
      phone: data.phone || '+1234567890',
      role: data.role || 'homeowner',
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// Use mock service for now
const authService = mockAuthService;

export { authService };