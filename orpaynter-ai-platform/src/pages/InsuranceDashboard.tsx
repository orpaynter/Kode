import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CameraIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAssessments } from '../hooks/useAssessments';
import { useAuth } from '../hooks/useAuth';
interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  propertyAddress: string;
  incidentDate: Date;
  claimDate: Date;
  damageType: string;
  estimatedAmount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid';
  adjusterId?: string;
  assessmentId?: string;
  documents: string[];
  photos: string[];
  notes?: string;
}

interface Assessment {
  id: string;
  propertyAddress: string;
  damageLevel?: 'minor' | 'moderate' | 'severe';
  estimatedCost?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  images: string[];
  claimId?: string;
  aiConfidence?: number;
}

export function InsuranceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'assessments' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const pendingClaims: InsuranceClaim[] = [
    {
      id: 'CLM-2024-001',
      policyNumber: 'POL-789456123',
      claimantName: 'John Smith',
      claimantEmail: 'john@example.com',
      claimantPhone: '(555) 123-4567',
      propertyAddress: '123 Main St, Anytown, ST 12345',
      incidentDate: new Date('2024-01-15'),
      reportedDate: new Date('2024-01-16'),
      status: 'under_review',
      claimAmount: 15000,
      estimatedDamage: 12500,
      damageType: 'storm_damage',
      description: 'Roof damage from severe thunderstorm with hail',
      adjusterAssigned: 'Sarah Johnson',
      priority: 'high'
    },
    {
      id: 'CLM-2024-002',
      policyNumber: 'POL-456789012',
      claimantName: 'Mike Wilson',
      claimantEmail: 'mike@example.com',
      claimantPhone: '(555) 987-6543',
      propertyAddress: '456 Oak Ave, Somewhere, ST 67890',
      incidentDate: new Date('2024-01-20'),
      reportedDate: new Date('2024-01-21'),
      status: 'pending_assessment',
      claimAmount: 8500,
      damageType: 'water_damage',
      description: 'Water damage from roof leak during recent storms',
      priority: 'medium'
    }
  ];

  // Fetch real data from Supabase
  const { assessments, loading: assessmentsLoading } = useAssessments();
  const { user } = useAuth();
  
  // Transform assessments to match insurance claim format
  const recentAssessments = assessments?.slice(0, 5).map(assessment => ({
    id: assessment.id,
    propertyAddress: assessment.property_address,
    status: assessment.status,
    createdAt: new Date(assessment.created_at),
    damageLevel: assessment.damage_level,
    estimatedCost: assessment.estimated_cost || 0,
    images: [],
    aiConfidence: assessment.ai_confidence || 0,
    claimId: `CLM-${new Date(assessment.created_at).getFullYear()}-${assessment.id.slice(-3)}`
  })) || [];

  const stats = {
    pendingClaims: assessments?.filter(a => a.status === 'pending').length || 0,
    processedToday: assessments?.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.created_at).toDateString() === today;
    }).length || 0,
    avgProcessingTime: 3.2,
    fraudDetected: 2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'text-accent-green';
      case 'under_review':
      case 'processing':
        return 'text-accent-blue';
      case 'pending_assessment':
      case 'pending':
        return 'text-yellow-400';
      case 'denied':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'under_review':
      case 'processing':
        return <ClockIcon className="h-5 w-5" />;
      case 'pending_assessment':
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'denied':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDamageColor = (level: string) => {
    switch (level) {
      case 'minor':
        return 'text-accent-green';
      case 'moderate':
        return 'text-yellow-400';
      case 'severe':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredClaims = pendingClaims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-accent-green to-accent-blue rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Sarah!</h1>
            <p className="text-green-100">
              Manage insurance claims, review AI assessments, and streamline the claims process with advanced analytics.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/claims/new"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Claim
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Claims</p>
              <p className="text-2xl font-bold text-white">{stats.pendingClaims}</p>
            </div>
            <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-accent-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processed Today</p>
              <p className="text-2xl font-bold text-white">{stats.processedToday}</p>
            </div>
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Processing Time</p>
              <p className="text-2xl font-bold text-white">{stats.avgProcessingTime} days</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple bg-opacity-20 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-accent-purple" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fraud Detected</p>
              <p className="text-2xl font-bold text-white">{stats.fraudDetected}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'claims', label: 'Claims', icon: DocumentTextIcon },
            { id: 'assessments', label: 'AI Assessments', icon: CameraIcon },
            { id: 'reports', label: 'Reports', icon: DocumentArrowDownIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-green text-accent-green'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Claims */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Priority Claims</h2>
              <Link
                to="/claims"
                className="text-accent-green hover:text-green-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {pendingClaims.slice(0, 3).map(claim => (
                <div key={claim.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-medium">{claim.id}</p>
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(claim.priority)}`}></span>
                      </div>
                      <p className="text-sm text-gray-400">{claim.claimantName}</p>
                      <p className="text-sm text-gray-500">{claim.propertyAddress}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      <span className="text-sm capitalize">{claim.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-300">
                      ${claim.claimAmount?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {claim.reportedDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-accent-green hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      Review
                    </button>
                    <button className="px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                      <PhoneIcon className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Assessments */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent AI Assessments</h2>
              <Link
                to="/assessments"
                className="text-accent-blue hover:text-blue-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentAssessments.map(assessment => (
                <div key={assessment.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium">{assessment.id}</p>
                      <p className="text-sm text-gray-400">{assessment.propertyAddress}</p>
                      {assessment.claimId && (
                        <p className="text-sm text-gray-500">Claim: {assessment.claimId}</p>
                      )}
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(assessment.status)}`}>
                      {getStatusIcon(assessment.status)}
                      <span className="text-sm capitalize">{assessment.status}</span>
                    </div>
                  </div>
                  
                  {assessment.damageLevel && (
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-sm font-medium ${getDamageColor(assessment.damageLevel)}`}>
                        {assessment.damageLevel.charAt(0).toUpperCase() + assessment.damageLevel.slice(1)} Damage
                      </span>
                      {assessment.aiConfidence && (
                        <span className="text-sm text-gray-300">
                          AI Confidence: {assessment.aiConfidence}%
                        </span>
                      )}
                    </div>
                  )}
                  
                  {assessment.estimatedCost && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-300">
                        Est. Cost: ${assessment.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      View Report
                    </button>
                    <button className="px-3 py-2 bg-accent-purple hover:bg-purple-600 text-white text-sm rounded-lg transition-colors">
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Claims Management</h2>
            <Link
              to="/claims/new"
              className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              New Claim
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims by ID, name, or policy number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
            >
              <option value="all">All Status</option>
              <option value="pending_assessment">Pending Assessment</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
          
          <div className="grid gap-4">
            {filteredClaims.map(claim => (
              <div key={claim.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-white font-medium">{claim.id}</h3>
                      <p className="text-sm text-gray-400">Policy: {claim.policyNumber}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(claim.priority)}`}></span>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    <span className="capitalize">{claim.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Claimant</p>
                    <p className="text-white font-medium">{claim.claimantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Claim Amount</p>
                    <p className="text-white font-medium">${claim.claimAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Damage Type</p>
                    <p className="text-white font-medium">
                      {claim.damageType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Reported</p>
                    <p className="text-white font-medium">{claim.reportedDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Property Address</p>
                  <p className="text-gray-300">{claim.propertyAddress}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-gray-300">{claim.description}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                    Review Claim
                  </button>
                  <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PhoneIcon className="h-4 w-4 inline mr-2" />
                    Contact Claimant
                  </button>
                  <button className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
                    Schedule Assessment
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <CameraIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Assessment Review</h3>
            <p className="text-gray-400 mb-6">
              Advanced AI assessment review and validation tools are coming soon. Review AI-generated damage reports and validate findings.
            </p>
            <button className="px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <DocumentArrowDownIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Analytics & Reports</h3>
            <p className="text-gray-400 mb-6">
              Comprehensive reporting and analytics features are coming soon. Generate detailed reports on claims processing, fraud detection, and performance metrics.
            </p>
            <button className="px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}