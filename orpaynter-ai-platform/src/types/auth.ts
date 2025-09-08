// Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  profile_data?: Record<string, any>;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'homeowner' | 'contractor' | 'insurance' | 'supplier';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}