// User and Authentication Types
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

// Assessment Types
export interface Assessment {
  id: string;
  user_id: string;
  property_address: string;
  images_metadata: ImageMetadata[];
  notes?: string;
  status: AssessmentStatus;
  created_at: string;
  completed_at?: string;
}

export type AssessmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImageMetadata {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface AIReport {
  id: string;
  assessment_id: string;
  damage_analysis: DamageAnalysis;
  confidence_score: number;
  recommendations: Recommendation[];
  summary: string;
  generated_at: string;
}

export interface DamageAnalysis {
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  damage_areas: DamageArea[];
  estimated_age: number;
  material_type: string;
}

export interface DamageArea {
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  description: string;
  repair_urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface Recommendation {
  type: 'repair' | 'replacement' | 'maintenance' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimated_cost?: number;
  timeline?: string;
}

// Project Types
export interface Project {
  id: string;
  user_id: string;
  assessment_id?: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  estimated_cost?: number;
  start_date?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  caption?: string;
  type: 'before' | 'during' | 'after' | 'reference';
  uploaded_at: string;
}

export interface CostEstimate {
  id: string;
  project_id: string;
  materials: MaterialCost[];
  labor: LaborCost[];
  total_amount: number;
  status: 'draft' | 'approved' | 'rejected';
  created_at: string;
}

export interface MaterialCost {
  item: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface LaborCost {
  task: string;
  hours: number;
  hourly_rate: number;
  total_cost: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  billing_cycle: 'monthly' | 'annual';
  amount: number;
  stripe_subscription_id?: string;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
}

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid';

export interface PlanFeatures {
  name: string;
  price_monthly: number;
  price_annual: number;
  features: string[];
  ai_scans_limit?: number;
  support_level: 'email' | 'priority' | 'dedicated';
}

// Lead and Business Types
export interface Lead {
  id: string;
  contractor_id: string;
  assessment_id: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  created_at: string;
  last_contact?: string;
export interface InsuranceClaim {
  id: string;
  user_id: string;
  assessment_id: string;
  claim_number: string;
  status: 'filed' | 'under_review' | 'approved' | 'denied' | 'paid';
  claim_amount: number;
  filed_date: string;
  updated_at: string;
}

// Notification and Email Types
export type EmailTemplate = {
  subject: string;
  html: string;
  text?: string;
};

export interface FraudAlert {
  id: string;
  claim_id: string;
  alert_type: string;
  risk_score: number;
  analysis_data: Record<string, any>;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  resolved_at?: string;
}

// UI and Form Types
export interface FormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  images: File[];
  notes?: string;
}

export interface DashboardMetrics {
  total_assessments: number;
  pending_projects: number;
  active_subscriptions: number;
  revenue_impact: number;
  accuracy_percentage: number;
}

export interface TrustMetrics {
  accuracy_percentage: number;
  revenue_impact: string;
  total_scans: number;
  customer_satisfaction: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total_count: number;
  has_more: boolean;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status_code: number;
}

// Navigation and Route Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles?: UserRole[];
  children?: NavItem[];
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  roles?: UserRole[];
  requiresAuth?: boolean;
}