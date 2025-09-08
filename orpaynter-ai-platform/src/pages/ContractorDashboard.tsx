import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Project, Lead } from '../types';

export function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'leads' | 'analytics'>('overview');

  // Mock data
  const activeProjects: Project[] = [
    {
      id: '1',
      title: 'Residential Roof Replacement - Oak Street',
      description: 'Complete roof replacement with architectural shingles',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20'),
      assignedTo: 'contractor-1',
      estimatedCost: 15000,
      actualCost: 8500,
      completionPercentage: 65,
      clientName: 'John Smith',
      clientEmail: 'john@example.com',
      clientPhone: '(555) 123-4567'
    },
    {
      id: '2',
      title: 'Commercial Roof Repair - Main Plaza',
      description: 'Emergency leak repair and preventive maintenance',
      status: 'pending',
      priority: 'urgent',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
      assignedTo: 'contractor-1',
      estimatedCost: 8500,
      clientName: 'ABC Corporation',
      clientEmail: 'facilities@abc.com',
      clientPhone: '(555) 987-6543'
    }
  ];

  const newLeads: Lead[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      address: '789 Pine Street, Anytown, ST 12345',
      projectType: 'roof_replacement',
      urgency: 'medium',
      estimatedBudget: 12000,
      description: 'Looking for complete roof replacement after storm damage',
      status: 'new',
      createdAt: new Date('2024-01-23'),
      source: 'ai_assessment'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '(555) 345-6789',
      address: '321 Elm Avenue, Somewhere, ST 67890',
      projectType: 'roof_repair',
      urgency: 'high',
      estimatedBudget: 5000,
      description: 'Urgent leak repair needed in multiple areas',
      status: 'contacted',
      createdAt: new Date('2024-01-22'),
      source: 'referral'
    }
  ];

  const stats = {
    activeProjects: 8,
    newLeads: 12,
    monthlyRevenue: 45000,
    completionRate: 94
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-accent-green';
      case 'in_progress':
        return 'text-accent-blue';
      case 'pending':
        return 'text-yellow-400';
      case 'urgent':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5" />;
      case 'pending':
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Mike!</h1>
            <p className="text-purple-100">
              Manage your roofing projects, track leads, and grow your business with AI-powered insights.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple bg-opacity-20 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-6 w-6 text-accent-purple" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Leads</p>
              <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
            </div>
            <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-accent-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
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
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'projects', label: 'Projects', icon: WrenchScrewdriverIcon },
            { id: 'leads', label: 'Leads', icon: UserGroupIcon },
            { id: 'analytics', label: 'Analytics', icon: DocumentTextIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-purple text-accent-purple'
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
          {/* Active Projects */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Projects</h2>
              <Link
                to="/projects"
                className="text-accent-purple hover:text-purple-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeProjects.map(project => (
                <div key={project.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-medium">{project.title}</p>
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}></span>
                      </div>
                      <p className="text-sm text-gray-400">{project.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Client: {project.clientName}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="text-sm capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  {project.completionPercentage !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-white">{project.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      {project.actualCost ? `$${project.actualCost.toLocaleString()} / ` : ''}${project.estimatedCost?.toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded transition-colors">
                        <PhoneIcon className="h-4 w-4 inline mr-1" />
                        Contact
                      </button>
                      <button className="px-3 py-1 bg-accent-purple hover:bg-purple-600 text-white text-sm rounded transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Leads */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">New Leads</h2>
              <Link
                to="/leads"
                className="text-accent-blue hover:text-blue-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {newLeads.map(lead => (
                <div key={lead.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-medium">{lead.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full bg-opacity-20 ${
                          lead.status === 'new' ? 'bg-accent-blue text-accent-blue' :
                          lead.status === 'contacted' ? 'bg-yellow-500 text-yellow-400' :
                          'bg-gray-500 text-gray-400'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {lead.address}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {lead.projectType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div className={`text-right`}>
                      <p className={`text-sm font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency.charAt(0).toUpperCase() + lead.urgency.slice(1)} Priority
                      </p>
                      <p className="text-sm text-gray-300">
                        ${lead.estimatedBudget?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {lead.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                      <PhoneIcon className="h-4 w-4 inline mr-1" />
                      Call
                    </button>
                    <button className="flex-1 px-3 py-2 bg-accent-green hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                      <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">All Projects</h2>
            <Link
              to="/projects/new"
              className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              New Project
            </Link>
          </div>
          
          <div className="grid gap-4">
            {activeProjects.map(project => (
              <div key={project.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-white font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-400">{project.description}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></span>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Client</p>
                    <p className="text-white font-medium">{project.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Budget</p>
                    <p className="text-white font-medium">${project.estimatedCost?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Progress</p>
                    <p className="text-white font-medium">{project.completionPercentage || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Updated</p>
                    <p className="text-white font-medium">{project.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PhoneIcon className="h-4 w-4 inline mr-2" />
                    Contact Client
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                    Update Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Lead Management</h2>
            <div className="flex space-x-2">
              <select className="px-3 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white text-sm">
                <option>All Leads</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
              </select>
            </div>
          </div>
          
          <div className="grid gap-4">
            {newLeads.map(lead => (
              <div key={lead.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-white font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-400 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {lead.address}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      lead.status === 'new' ? 'bg-accent-blue bg-opacity-20 text-accent-blue' :
                      lead.status === 'contacted' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                      'bg-gray-500 bg-opacity-20 text-gray-400'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getUrgencyColor(lead.urgency)}`}>
                      {lead.urgency.charAt(0).toUpperCase() + lead.urgency.slice(1)} Priority
                    </p>
                    <p className="text-sm text-gray-400">
                      {lead.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Project Type</p>
                    <p className="text-white font-medium">
                      {lead.projectType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Budget</p>
                    <p className="text-white font-medium">${lead.estimatedBudget?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Source</p>
                    <p className="text-white font-medium">
                      {lead.source === 'ai_assessment' ? 'AI Assessment' : 'Referral'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{lead.description}</p>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PhoneIcon className="h-4 w-4 inline mr-2" />
                    Call {lead.phone}
                  </button>
                  <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                    <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                    Email {lead.email}
                  </button>
                  <button className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
                    Create Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Business Analytics</h3>
            <p className="text-gray-400 mb-6">
              Advanced analytics and reporting features are coming soon. Track performance, revenue trends, and business insights.
            </p>
            <button className="px-6 py-3 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}