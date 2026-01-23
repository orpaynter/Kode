import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  CameraIcon,
  CreditCardIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAssessments } from '../hooks/useAssessments';
import { useProjects, useUserStats } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';


export function HomeownerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'assessments' | 'billing'>('overview');
  const { user } = useAuth();
  
  // Fetch real data from Supabase
  const { assessments, loading: assessmentsLoading } = useAssessments();
  const { projects, loading: projectsLoading } = useProjects();
  const { stats, loading: statsLoading } = useUserStats();
  
  // Filter recent assessments (last 5)
  const recentAssessments = assessments?.slice(0, 5) || [];
  
  // Filter active projects
  const activeProjects = projects?.filter(p => p.status === 'in_progress' || p.status === 'planning') || [];
  
  // Default stats if loading
  const dashboardStats = stats || {
    totalAssessments: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSavings: 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-accent-green';
      case 'processing':
      case 'in_progress':
        return 'text-accent-blue';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'processing':
      case 'in_progress':
        return <ClockIcon className="h-5 w-5" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
            <p className="text-blue-100">
              Manage your roof assessments, track projects, and connect with trusted contractors.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/assessment"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Assessments</p>
              <p className="text-2xl font-bold text-white">{statsLoading ? '...' : dashboardStats.totalAssessments}</p>
            </div>
            <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-accent-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-white">{statsLoading ? '...' : dashboardStats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple bg-opacity-20 rounded-lg flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-accent-purple" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Projects</p>
              <p className="text-2xl font-bold text-white">{statsLoading ? '...' : dashboardStats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Savings</p>
              <p className="text-2xl font-bold text-white">{statsLoading ? '...' : `$${dashboardStats.totalSavings.toLocaleString()}`}</p>
            </div>
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: HomeIcon },
            { id: 'projects', label: 'Projects', icon: DocumentTextIcon },
            { id: 'assessments', label: 'Assessments', icon: CameraIcon },
            { id: 'billing', label: 'Billing', icon: CreditCardIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-blue text-accent-blue'
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
          {/* Recent Assessments */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Assessments</h2>
              <Link
                to="/assessment"
                className="text-accent-blue hover:text-blue-400 text-sm font-medium"
              >
                New Assessment
              </Link>
            </div>
            
            <div className="space-y-4">
              {assessmentsLoading ? (
                <div className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ) : recentAssessments.length > 0 ? (
                recentAssessments.map(assessment => (
                  <div key={assessment.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{assessment.property_address}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 ${getStatusColor(assessment.status)}`}>
                        {getStatusIcon(assessment.status)}
                        <span className="text-sm capitalize">{assessment.status}</span>
                      </div>
                    </div>
                    
                    {assessment.damage_level && (
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-sm font-medium ${getDamageColor(assessment.damage_level)}`}>
                          {assessment.damage_level.charAt(0).toUpperCase() + assessment.damage_level.slice(1)} Damage
                        </span>
                        {assessment.estimated_cost && (
                          <span className="text-sm text-gray-300">
                            Est. ${assessment.estimated_cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                        <EyeIcon className="h-4 w-4 inline mr-1" />
                        View Report
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CameraIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No assessments yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start by creating your first roof assessment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Projects</h2>
              <Link
                to="/projects"
                className="text-accent-blue hover:text-blue-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {projectsLoading ? (
                <div className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2 mb-3"></div>
                    <div className="h-2 bg-gray-600 rounded w-full"></div>
                  </div>
                </div>
              ) : activeProjects.length > 0 ? (
                activeProjects.map(project => (
                  <div key={project.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      </div>
                      <div className={`flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="text-sm capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-white">{project.completion_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completion_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        ${project.actual_cost?.toLocaleString() || '0'} / ${project.estimated_cost?.toLocaleString() || '0'}
                      </span>
                      <button className="px-3 py-1 bg-accent-purple hover:bg-purple-600 text-white text-sm rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <HomeIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No active projects</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start by getting a roof assessment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <HomeIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Project Management</h3>
            <p className="text-gray-400 mb-6">
              Detailed project management features are coming soon. Track progress, communicate with contractors, and manage timelines.
            </p>
            <button className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">All Assessments</h2>
            <Link
              to="/assessment"
              className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              New Assessment
            </Link>
          </div>
          
          <div className="grid gap-4">
            {assessmentsLoading ? (
              <div className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2 mb-4"></div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="h-3 bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ) : assessments && assessments.length > 0 ? (
              assessments.map(assessment => (
                <div key={assessment.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">{assessment.property_address}</h3>
                      <p className="text-sm text-gray-400">
                        Submitted on {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(assessment.status)}`}>
                      {getStatusIcon(assessment.status)}
                      <span className="capitalize">{assessment.status}</span>
                    </div>
                  </div>
                  
                  {assessment.damage_level && (
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Damage Level</p>
                        <p className={`font-medium ${getDamageColor(assessment.damage_level)}`}>
                          {assessment.damage_level.charAt(0).toUpperCase() + assessment.damage_level.slice(1)}
                        </p>
                      </div>
                      {assessment.estimated_cost && (
                        <div>
                          <p className="text-sm text-gray-400">Estimated Cost</p>
                          <p className="text-white font-medium">${assessment.estimated_cost.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-400">Images</p>
                        <p className="text-white font-medium">{assessment.images?.length || 0} uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                      View Full Report
                    </button>
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CameraIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Assessments Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start by creating your first roof assessment to get damage analysis and cost estimates.
                </p>
                <Link
                  to="/assessment"
                  className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Create Assessment
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <CreditCardIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Billing & Payments</h3>
            <p className="text-gray-400 mb-6">
              Manage your subscription, view invoices, and track payment history.
            </p>
            <button className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}