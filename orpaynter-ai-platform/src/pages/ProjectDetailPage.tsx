import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
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
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Project, ProjectMilestone, ProjectDocument, ProjectImage } from '../types';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock project data - in real app, fetch based on ID
  const project: Project = {
    id: 'PRJ-001',
    title: 'Residential Roof Replacement',
    description: 'Complete roof replacement for storm damage on single-family home. The project includes removal of existing damaged shingles, inspection of underlying structure, replacement of damaged decking, installation of new underlayment, and installation of architectural shingles with proper ventilation system.',
    type: 'roofing',
    status: 'in_progress',
    priority: 'high',
    homeownerId: 'HO-001',
    homeownerName: 'John Smith',
    homeownerEmail: 'john.smith@email.com',
    homeownerPhone: '(555) 123-4567',
    contractorId: 'CON-001',
    contractorName: 'ABC Roofing Co.',
    contractorEmail: 'contact@abcroofing.com',
    contractorPhone: '(555) 987-6543',
    contractorWebsite: 'https://abcroofing.com',
    propertyAddress: '123 Main St, Anytown, ST 12345',
    estimatedCost: 15000,
    actualCost: 14500,
    startDate: new Date('2024-01-15'),
    estimatedCompletion: new Date('2024-02-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    progress: 65,
    images: [
      {
        id: 'IMG-001',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=damaged%20residential%20roof%20with%20missing%20shingles%20storm%20damage&image_size=landscape_4_3',
        caption: 'Initial damage assessment - missing shingles from storm',
        uploadedAt: new Date('2024-01-10'),
        uploadedBy: 'John Smith',
        category: 'before'
      },
      {
        id: 'IMG-002',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=roof%20tear%20off%20construction%20workers%20removing%20old%20shingles&image_size=landscape_4_3',
        caption: 'Tear-off in progress',
        uploadedAt: new Date('2024-01-18'),
        uploadedBy: 'ABC Roofing Co.',
        category: 'progress'
      },
      {
        id: 'IMG-003',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=new%20roof%20installation%20architectural%20shingles%20construction%20progress&image_size=landscape_4_3',
        caption: 'New shingle installation - 65% complete',
        uploadedAt: new Date('2024-01-22'),
        uploadedBy: 'ABC Roofing Co.',
        category: 'progress'
      }
    ],
    documents: [
      {
        id: 'DOC-001',
        name: 'Insurance Claim Report.pdf',
        type: 'pdf',
        size: '2.4 MB',
        url: '#',
        uploadedAt: new Date('2024-01-10'),
        uploadedBy: 'John Smith',
        category: 'insurance'
      },
      {
        id: 'DOC-002',
        name: 'Material Specifications.pdf',
        type: 'pdf',
        size: '1.8 MB',
        url: '#',
        uploadedAt: new Date('2024-01-12'),
        uploadedBy: 'ABC Roofing Co.',
        category: 'specifications'
      },
      {
        id: 'DOC-003',
        name: 'Building Permit.pdf',
        type: 'pdf',
        size: '856 KB',
        url: '#',
        uploadedAt: new Date('2024-01-14'),
        uploadedBy: 'ABC Roofing Co.',
        category: 'permits'
      },
      {
        id: 'DOC-004',
        name: 'Daily Progress Report - Week 1.xlsx',
        type: 'excel',
        size: '124 KB',
        url: '#',
        uploadedAt: new Date('2024-01-19'),
        uploadedBy: 'ABC Roofing Co.',
        category: 'reports'
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'Material Delivery',
        description: 'All roofing materials delivered to job site',
        completed: true,
        date: new Date('2024-01-18'),
        completedAt: new Date('2024-01-18'),
        notes: 'Materials delivered on schedule. Quality inspection passed.'
      },
      {
        id: '2',
        title: 'Tear-off Complete',
        description: 'Removal of old roofing materials and inspection of decking',
        completed: true,
        date: new Date('2024-01-20'),
        completedAt: new Date('2024-01-20'),
        notes: 'Found minor decking damage in northwest corner. Replaced 3 sheets of plywood.'
      },
      {
        id: '3',
        title: 'New Roof Installation',
        description: 'Installation of new underlayment and shingles',
        completed: false,
        date: new Date('2024-01-25'),
        notes: 'Currently 65% complete. Weather delays pushed timeline back 2 days.'
      },
      {
        id: '4',
        title: 'Final Inspection',
        description: 'City inspection and project completion',
        completed: false,
        date: new Date('2024-02-10')
      }
    ],
    notes: [
      {
        id: 'NOTE-001',
        content: 'Weather delay due to heavy rain. Work resumed the following day.',
        author: 'ABC Roofing Co.',
        createdAt: new Date('2024-01-19'),
        type: 'update'
      },
      {
        id: 'NOTE-002',
        content: 'Homeowner requested upgrade to premium shingles. Cost adjustment approved.',
        author: 'John Smith',
        createdAt: new Date('2024-01-16'),
        type: 'change_request'
      },
      {
        id: 'NOTE-003',
        content: 'Additional decking repair required. Estimated $500 additional cost.',
        author: 'ABC Roofing Co.',
        createdAt: new Date('2024-01-20'),
        type: 'issue'
      }
    ]
  };

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
        return <HomeIcon className="h-6 w-6" />;
      case 'restoration':
        return <BuildingOfficeIcon className="h-6 w-6" />;
      case 'siding':
        return <HomeIcon className="h-6 w-6" />;
      case 'emergency':
        return <ExclamationTriangleIcon className="h-6 w-6" />;
      default:
        return <HomeIcon className="h-6 w-6" />;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'excel':
        return '📊';
      case 'word':
        return '📝';
      case 'image':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'milestones', name: 'Milestones', icon: CheckCircleIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'images', name: 'Images', icon: PhotoIcon },
    { id: 'communication', name: 'Communication', icon: ChatBubbleLeftRightIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 bg-dark-secondary hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-xl flex items-center justify-center">
              {getTypeIcon(project.type)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-gray-400">{project.id}</span>
                <span className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="capitalize">{project.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
          <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <PencilIcon className="h-5 w-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Progress</p>
              <p className="text-white text-xl font-semibold">{project.progress}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-accent-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-accent-blue" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Budget</p>
              <p className="text-white text-xl font-semibold">${project.estimatedCost?.toLocaleString()}</p>
              {project.actualCost && (
                <p className="text-gray-400 text-sm">Actual: ${project.actualCost.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Timeline</p>
              <p className="text-white text-lg font-semibold">
                {project.startDate && project.estimatedCompletion
                  ? `${Math.ceil((project.estimatedCompletion.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                  : 'TBD'}
              </p>
              {project.estimatedCompletion && (
                <p className="text-gray-400 text-sm">
                  Due: {project.estimatedCompletion.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Milestones</p>
              <p className="text-white text-xl font-semibold">
                {project.milestones?.filter(m => m.completed).length || 0}/{project.milestones?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-secondary rounded-xl border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent-green text-accent-green'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Description</label>
                        <p className="text-white mt-1">{project.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Type</label>
                          <p className="text-white mt-1 capitalize">{project.type}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Priority</label>
                          <p className="text-white mt-1 capitalize">{project.priority}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Property Address</label>
                        <p className="text-white mt-1">{project.propertyAddress}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Start Date</label>
                          <p className="text-white mt-1">
                            {project.startDate ? project.startDate.toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Estimated Completion</label>
                          <p className="text-white mt-1">
                            {project.estimatedCompletion ? project.estimatedCompletion.toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Homeowner Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Homeowner</h3>
                    <div className="bg-dark-primary rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-accent-green" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{project.homeownerName}</p>
                          <p className="text-gray-400 text-sm">Property Owner</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {project.homeownerEmail && (
                          <div className="flex items-center space-x-2 text-sm">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${project.homeownerEmail}`} className="text-accent-blue hover:underline">
                              {project.homeownerEmail}
                            </a>
                          </div>
                        )}
                        {project.homeownerPhone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${project.homeownerPhone}`} className="text-accent-blue hover:underline">
                              {project.homeownerPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contractor Info */}
                  {project.contractorName && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Contractor</h3>
                      <div className="bg-dark-primary rounded-lg p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="h-5 w-5 text-accent-blue" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{project.contractorName}</p>
                            <p className="text-gray-400 text-sm">General Contractor</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {project.contractorEmail && (
                            <div className="flex items-center space-x-2 text-sm">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                              <a href={`mailto:${project.contractorEmail}`} className="text-accent-blue hover:underline">
                                {project.contractorEmail}
                              </a>
                            </div>
                          )}
                          {project.contractorPhone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <PhoneIcon className="h-4 w-4 text-gray-400" />
                              <a href={`tel:${project.contractorPhone}`} className="text-accent-blue hover:underline">
                                {project.contractorPhone}
                              </a>
                            </div>
                          )}
                          {project.contractorWebsite && (
                            <div className="flex items-center space-x-2 text-sm">
                              <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                              <a href={project.contractorWebsite} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {project.notes?.slice(0, 3).map(note => (
                    <div key={note.id} className="bg-dark-primary rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white">{note.content}</p>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                            <span>{note.author}</span>
                            <span>•</span>
                            <span>{note.createdAt.toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              note.type === 'update' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                              note.type === 'issue' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                              'bg-yellow-500 bg-opacity-20 text-yellow-400'
                            }`}>
                              {note.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Project Milestones</h3>
                <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Milestone</span>
                </button>
              </div>
              <div className="space-y-4">
                {project.milestones?.map((milestone, index) => (
                  <div key={milestone.id} className="bg-dark-primary rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed
                          ? 'bg-accent-green text-white'
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${
                            milestone.completed ? 'text-white' : 'text-gray-300'
                          }`}>
                            {milestone.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {milestone.date.toLocaleDateString()}
                            </span>
                            {milestone.completed && milestone.completedAt && (
                              <span className="text-sm text-accent-green">
                                ✓ {milestone.completedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {milestone.description && (
                          <p className="text-gray-400 mt-1">{milestone.description}</p>
                        )}
                        {milestone.notes && (
                          <div className="mt-3 p-3 bg-dark-secondary rounded-lg">
                            <p className="text-gray-300 text-sm">{milestone.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Project Documents</h3>
                <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>Upload Document</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.documents?.map(doc => (
                  <div key={doc.id} className="bg-dark-primary rounded-lg p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{doc.name}</h4>
                        <p className="text-gray-400 text-sm">{doc.size}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Uploaded by {doc.uploadedBy} on {doc.uploadedAt.toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="text-accent-blue hover:text-blue-400 text-sm flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="text-accent-green hover:text-green-400 text-sm flex items-center space-x-1">
                            <DownloadIcon className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Project Images</h3>
                <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>Upload Images</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images?.map(image => (
                  <div key={image.id} className="bg-dark-primary rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-800">
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium">{image.caption}</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Uploaded by {image.uploadedBy} on {image.uploadedAt.toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          image.category === 'before' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                          image.category === 'progress' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                          'bg-green-500 bg-opacity-20 text-green-400'
                        }`}>
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Project Communication</h3>
              <div className="bg-dark-primary rounded-lg p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">Communication Center</h4>
                <p className="text-gray-400 mb-6">
                  Integrated messaging and communication features coming soon.
                </p>
                <button className="px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                  Enable Notifications
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Project Settings</h3>
              <div className="bg-dark-primary rounded-lg p-8 text-center">
                <Cog6ToothIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">Project Configuration</h4>
                <p className="text-gray-400 mb-6">
                  Advanced project settings and configuration options coming soon.
                </p>
                <button className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Configure Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Project</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone and will permanently remove all project data, including documents and images.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteModal(false);
                  navigate('/projects');
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}