import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
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
// Project interface is now imported from the hooks

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { user } = useAuth();
  const { projects, loading: projectsLoading, error } = useProjects();

  // Show loading state
  if (projectsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">
              Manage and track all construction and restoration projects
            </p>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-12 border border-gray-700 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-600 rounded mx-auto mb-2 w-48"></div>
            <div className="h-4 bg-gray-600 rounded mx-auto w-64"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">
              Manage and track all construction and restoration projects
            </p>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-12 border border-gray-700 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Projects</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const projectsList = projects || [];

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

  const filteredProjects = projectsList.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.property_address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.project_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'created_date':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'start_date':
        return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
      case 'cost':
        return (b.estimated_cost || 0) - (a.estimated_cost || 0);
      case 'progress':
        return (b.completion_percentage || 0) - (a.completion_percentage || 0);
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
              {sortedProjects.length} of {projectsList.length} projects
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
                    {getTypeIcon(project.project_type || 'roofing')}
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
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 truncate">{project.property_address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    ${project.estimated_cost?.toLocaleString()}
                    {project.actual_cost && ` (Actual: $${project.actual_cost.toLocaleString()})`}
                  </span>
                </div>
                {project.start_date && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.estimated_completion && ` - ${new Date(project.estimated_completion).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress */}
              {project.completion_percentage !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{project.completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-accent-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.completion_percentage}%` }}
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
                          {getTypeIcon(project.project_type || 'roofing')}
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
                      <div className="text-sm text-gray-400 truncate max-w-xs">{project.property_address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">${project.estimated_cost?.toLocaleString()}</div>
                      {project.actual_cost && (
                        <div className="text-sm text-gray-400">Actual: ${project.actual_cost.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.completion_percentage !== undefined && (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-accent-green h-2 rounded-full"
                              style={{ width: `${project.completion_percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white">{project.completion_percentage}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                      </div>
                      {project.estimated_completion && (
                        <div className="text-sm text-gray-400">
                          Est: {new Date(project.estimated_completion).toLocaleDateString()}
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