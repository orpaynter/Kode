import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Project } from '../types';

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock projects data
  const projects: Project[] = [
    {
      id: 'PRJ-001',
      title: 'Residential Roof Replacement',
      description: 'Complete roof replacement for storm damage on single-family home',
      type: 'roofing',
      status: 'in_progress',
      priority: 'high',
      homeownerId: 'HO-001',
      homeownerName: 'John Smith',
      contractorId: 'CON-001',
      contractorName: 'ABC Roofing Co.',
      propertyAddress: '123 Main St, Anytown, ST 12345',
      estimatedCost: 15000,
      actualCost: 14500,
      startDate: new Date('2024-01-15'),
      estimatedCompletion: new Date('2024-02-15'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-22'),
      progress: 65,
      images: [],
      documents: [],
      milestones: [
        { id: '1', title: 'Material Delivery', completed: true, date: new Date('2024-01-18') },
        { id: '2', title: 'Tear-off Complete', completed: true, date: new Date('2024-01-20') },
        { id: '3', title: 'New Roof Installation', completed: false, date: new Date('2024-01-25') },
        { id: '4', title: 'Final Inspection', completed: false, date: new Date('2024-02-10') }
      ]
    },
    {
      id: 'PRJ-002',
      title: 'Commercial Building Restoration',
      description: 'Water damage restoration and repairs for office building',
      type: 'restoration',
      status: 'planning',
      priority: 'medium',
      homeownerId: 'HO-002',
      homeownerName: 'Elite Properties LLC',
      contractorId: 'CON-002',
      contractorName: 'RestorePro Services',
      propertyAddress: '456 Business Ave, Commerce City, ST 67890',
      estimatedCost: 45000,
      startDate: new Date('2024-02-01'),
      estimatedCompletion: new Date('2024-03-15'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      progress: 10,
      images: [],
      documents: [],
      milestones: [
        { id: '1', title: 'Assessment Complete', completed: true, date: new Date('2024-01-22') },
        { id: '2', title: 'Insurance Approval', completed: false, date: new Date('2024-01-30') },
        { id: '3', title: 'Material Procurement', completed: false, date: new Date('2024-02-05') },
        { id: '4', title: 'Restoration Work', completed: false, date: new Date('2024-02-10') }
      ]
    },
    {
      id: 'PRJ-003',
      title: 'Siding Repair & Paint',
      description: 'Hail damage repair and exterior painting',
      type: 'siding',
      status: 'completed',
      priority: 'low',
      homeownerId: 'HO-003',
      homeownerName: 'Mike Wilson',
      contractorId: 'CON-003',
      contractorName: 'Perfect Paint & Siding',
      propertyAddress: '789 Oak Street, Suburbia, ST 54321',
      estimatedCost: 8500,
      actualCost: 8200,
      startDate: new Date('2023-12-01'),
      estimatedCompletion: new Date('2023-12-20'),
      completedAt: new Date('2023-12-18'),
      createdAt: new Date('2023-11-25'),
      updatedAt: new Date('2023-12-18'),
      progress: 100,
      images: [],
      documents: [],
      milestones: [
        { id: '1', title: 'Damage Assessment', completed: true, date: new Date('2023-11-28') },
        { id: '2', title: 'Material Delivery', completed: true, date: new Date('2023-12-03') },
        { id: '3', title: 'Siding Repair', completed: true, date: new Date('2023-12-10') },
        { id: '4', title: 'Painting Complete', completed: true, date: new Date('2023-12-18') }
      ]
    },
    {
      id: 'PRJ-004',
      title: 'Emergency Roof Tarp',
      description: 'Emergency tarp installation after storm damage',
      type: 'emergency',
      status: 'on_hold',
      priority: 'urgent',
      homeownerId: 'HO-004',
      homeownerName: 'Sarah Johnson',
      propertyAddress: '321 Pine Ave, Stormville, ST 98765',
      estimatedCost: 2500,
      createdAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23'),
      progress: 0,
      images: [],
      documents: [],
      milestones: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-accent-green bg-accent-green bg-opacity-20';
      case 'in_progress':
        return 'text-accent-blue bg-accent-blue bg-opacity-20';
      case 'planning':
        return 'text-yellow-400 bg-yellow-400 bg-opacity-20';
      case 'on_hold':
        return 'text-red-400 bg-red-400 bg-opacity-20';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-400 bg-opacity-20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5" />;
      case 'planning':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'on_hold':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5" />;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roofing':
        return <HomeIcon className="h-5 w-5" />;
      case 'restoration':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'siding':
        return <HomeIcon className="h-5 w-5" />;
      case 'emergency':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <HomeIcon className="h-5 w-5" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'created_date':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'start_date':
        return (b.startDate?.getTime() || 0) - (a.startDate?.getTime() || 0);
      case 'cost':
        return (b.estimatedCost || 0) - (a.estimatedCost || 0);
      case 'progress':
        return (b.progress || 0) - (a.progress || 0);
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage and track all construction and restoration projects
          </p>
        </div>
        <Link
          to="/projects/new"
          className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="all">All Types</option>
            <option value="roofing">Roofing</option>
            <option value="restoration">Restoration</option>
            <option value="siding">Siding</option>
            <option value="emergency">Emergency</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="created_date">Created Date</option>
            <option value="start_date">Start Date</option>
            <option value="cost">Cost</option>
            <option value="progress">Progress</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400 text-sm">
              {sortedProjects.length} of {projects.length} projects
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent-green text-white'
                  : 'bg-dark-primary text-gray-400 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent-green text-white'
                  : 'bg-dark-primary text-gray-400 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <div key={project.id} className="bg-dark-secondary rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
                    {getTypeIcon(project.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{project.homeownerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 truncate">{project.propertyAddress}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    ${project.estimatedCost?.toLocaleString()}
                    {project.actualCost && ` (Actual: $${project.actualCost.toLocaleString()})`}
                  </span>
                </div>
                {project.startDate && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {project.startDate.toLocaleDateString()}
                      {project.estimatedCompletion && ` - ${project.estimatedCompletion.toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress */}
              {project.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-accent-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="flex-1 px-3 py-2 bg-accent-green hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button className="px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-secondary rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-primary">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedProjects.map(project => (
                  <tr key={project.id} className="hover:bg-dark-primary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
                          {getTypeIcon(project.type)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{project.title}</div>
                          <div className="text-sm text-gray-400">{project.id}</div>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{project.homeownerName}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{project.propertyAddress}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">${project.estimatedCost?.toLocaleString()}</div>
                      {project.actualCost && (
                        <div className="text-sm text-gray-400">Actual: ${project.actualCost.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.progress !== undefined && (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-accent-green h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white">{project.progress}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {project.startDate ? project.startDate.toLocaleDateString() : 'TBD'}
                      </div>
                      {project.estimatedCompletion && (
                        <div className="text-sm text-gray-400">
                          Est: {project.estimatedCompletion.toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="p-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button className="p-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <div className="bg-dark-secondary rounded-xl p-12 border border-gray-700 text-center">
          <HomeIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No projects match your current filters. Try adjusting your search criteria.'
              : 'Get started by creating your first project.'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Link
              to="/projects/new"
              className="inline-flex items-center px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}