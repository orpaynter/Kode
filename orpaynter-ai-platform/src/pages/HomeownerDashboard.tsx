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
import { Project, Assessment } from '../types';

export function HomeownerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'assessments' | 'billing'>('overview');

  // Mock data
  const recentAssessments: Assessment[] = [
    {
      id: '1',
      propertyAddress: '123 Main St, Anytown, ST 12345',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      damageLevel: 'moderate',
      estimatedCost: 8500,
      images: []
    },
    {
      id: '2',
      propertyAddress: '456 Oak Ave, Somewhere, ST 67890',
      status: 'processing',
      createdAt: new Date('2024-01-20'),
      images: []
    }
  ];

  const activeProjects: Project[] = [
    {
      id: '1',
      title: 'Main Street Roof Repair',
      description: 'Complete roof replacement with new shingles',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20'),
      assignedTo: 'contractor-1',
      estimatedCost: 12000,
      actualCost: 8500,
      completionPercentage: 65
    }
  ];

  const stats = {
    totalAssessments: 5,
    activeProjects: 2,
    completedProjects: 3,
    totalSavings: 15420
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
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
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
              <p className="text-2xl font-bold text-white">{stats.totalAssessments}</p>
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
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
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
              <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
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
              <p className="text-2xl font-bold text-white">${stats.totalSavings.toLocaleString()}</p>
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
              {recentAssessments.map(assessment => (
                <div key={assessment.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium truncate">{assessment.propertyAddress}</p>
                      <p className="text-sm text-gray-400">
                        {assessment.createdAt.toLocaleDateString()}
                      </p>
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
                      {assessment.estimatedCost && (
                        <span className="text-sm text-gray-300">
                          Est. ${assessment.estimatedCost.toLocaleString()}
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
              ))}
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
              {activeProjects.map(project => (
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
                      <span className="text-sm text-white">{project.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      ${project.actualCost?.toLocaleString()} / ${project.estimatedCost?.toLocaleString()}
                    </span>
                    <button className="px-3 py-1 bg-accent-purple hover:bg-purple-600 text-white text-sm rounded transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              
              {activeProjects.length === 0 && (
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
            {recentAssessments.map(assessment => (
              <div key={assessment.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-medium">{assessment.propertyAddress}</h3>
                    <p className="text-sm text-gray-400">
                      Submitted on {assessment.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(assessment.status)}`}>
                    {getStatusIcon(assessment.status)}
                    <span className="capitalize">{assessment.status}</span>
                  </div>
                </div>
                
                {assessment.damageLevel && (
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Damage Level</p>
                      <p className={`font-medium ${getDamageColor(assessment.damageLevel)}`}>
                        {assessment.damageLevel.charAt(0).toUpperCase() + assessment.damageLevel.slice(1)}
                      </p>
                    </div>
                    {assessment.estimatedCost && (
                      <div>
                        <p className="text-sm text-gray-400">Estimated Cost</p>
                        <p className="text-white font-medium">${assessment.estimatedCost.toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Images</p>
                      <p className="text-white font-medium">{assessment.images.length} uploaded</p>
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
            ))}
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