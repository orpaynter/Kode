import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { supabaseDataService } from '../services/supabaseData';
interface ProjectFormData {
  title: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate?: Date;
  priority: 'low' | 'medium' | 'high';
  address: string;
  contractorId?: string;
}

export function NewProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    type: 'roofing',
    priority: 'medium',
    propertyAddress: '',
    homeownerName: '',
    homeownerEmail: '',
    homeownerPhone: '',
    contractorId: '',
    estimatedCost: 0,
    startDate: '',
    estimatedCompletion: '',
    milestones: [],
    images: [],
    documents: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, name: 'Basic Information', icon: DocumentTextIcon },
    { id: 2, name: 'Property & Contact', icon: UserIcon },
    { id: 3, name: 'Timeline & Budget', icon: CalendarIcon },
    { id: 4, name: 'Additional Details', icon: PlusIcon }
  ];

  const projectTypes = [
    { value: 'roofing', label: 'Roofing', icon: HomeIcon },
    { value: 'restoration', label: 'Restoration', icon: BuildingOfficeIcon },
    { value: 'siding', label: 'Siding', icon: HomeIcon },
    { value: 'emergency', label: 'Emergency', icon: ExclamationTriangleIcon },
    { value: 'windows', label: 'Windows', icon: HomeIcon },
    { value: 'gutters', label: 'Gutters', icon: HomeIcon },
    { value: 'painting', label: 'Painting', icon: HomeIcon },
    { value: 'other', label: 'Other', icon: DocumentTextIcon }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  // Mock contractors data
  const contractors = [
    { id: 'CON-001', name: 'ABC Roofing Co.', specialties: ['roofing', 'gutters'], rating: 4.8 },
    { id: 'CON-002', name: 'RestorePro Services', specialties: ['restoration', 'emergency'], rating: 4.9 },
    { id: 'CON-003', name: 'Perfect Paint & Siding', specialties: ['siding', 'painting'], rating: 4.7 },
    { id: 'CON-004', name: 'Elite Construction', specialties: ['roofing', 'siding', 'windows'], rating: 4.6 },
    { id: 'CON-005', name: 'Emergency Response Team', specialties: ['emergency', 'restoration'], rating: 4.8 }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Project title is required';
        if (!formData.description.trim()) newErrors.description = 'Project description is required';
        if (!formData.type) newErrors.type = 'Project type is required';
        break;
      case 2:
        if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
        if (!formData.homeownerName.trim()) newErrors.homeownerName = 'Homeowner name is required';
        if (!formData.homeownerEmail.trim()) newErrors.homeownerEmail = 'Homeowner email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.homeownerEmail)) {
          newErrors.homeownerEmail = 'Please enter a valid email address';
        }
        if (!formData.homeownerPhone.trim()) newErrors.homeownerPhone = 'Homeowner phone is required';
        break;
      case 3:
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.estimatedCompletion) newErrors.estimatedCompletion = 'Estimated completion date is required';
        if (formData.estimatedCost <= 0) newErrors.estimatedCost = 'Estimated cost must be greater than 0';
        if (formData.startDate && formData.estimatedCompletion) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.estimatedCompletion);
          if (end <= start) {
            newErrors.estimatedCompletion = 'Completion date must be after start date';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!user) {
      setErrors({ ...errors, submit: 'You must be logged in to create a project' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create project data for Supabase
      const projectData = {
        title: formData.title,
        description: formData.description,
        project_type: formData.type,
        priority: formData.priority,
        property_address: formData.propertyAddress,
        homeowner_name: formData.homeownerName,
        homeowner_email: formData.homeownerEmail,
        homeowner_phone: formData.homeownerPhone,
        contractor_id: formData.contractorId || null,
        start_date: formData.startDate,
        estimated_completion: formData.estimatedCompletion,
        estimated_cost: formData.estimatedCost,
        status: 'planning',
        completion_percentage: 0,
        milestones: formData.milestones,
        created_by: user.id
      };

      const project = await supabaseDataService.createProject(projectData);
      
      // Navigate to the project details page
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ ...errors, submit: 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/projects"
            className="p-2 bg-dark-secondary hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Project</h1>
            <p className="text-gray-400 mt-1">Set up a new construction or restoration project</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  isActive ? 'text-accent-green' : 
                  isCompleted ? 'text-accent-green' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-accent-green bg-accent-green bg-opacity-20' :
                    isCompleted ? 'border-accent-green bg-accent-green' : 'border-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium">{step.name}</p>
                    <p className="text-sm text-gray-400">Step {step.id}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-accent-green' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Project Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Describe the project scope and requirements"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                          formData.type === type.value
                            ? 'border-accent-green bg-accent-green bg-opacity-20 text-accent-green'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {priorityLevels.map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                        formData.priority === priority.value
                          ? 'border-accent-green bg-accent-green bg-opacity-20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${priority.color}`}></span>
                      <span className="text-white font-medium">{priority.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property & Contact */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Property & Contact Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Address *
                </label>
                <input
                  type="text"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.propertyAddress ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter complete property address"
                />
                {errors.propertyAddress && <p className="text-red-400 text-sm mt-1">{errors.propertyAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Homeowner Name *
                </label>
                <input
                  type="text"
                  value={formData.homeownerName}
                  onChange={(e) => handleInputChange('homeownerName', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.homeownerName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter homeowner full name"
                />
                {errors.homeownerName && <p className="text-red-400 text-sm mt-1">{errors.homeownerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Homeowner Email *
                </label>
                <input
                  type="email"
                  value={formData.homeownerEmail}
                  onChange={(e) => handleInputChange('homeownerEmail', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.homeownerEmail ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.homeownerEmail && <p className="text-red-400 text-sm mt-1">{errors.homeownerEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Homeowner Phone *
                </label>
                <input
                  type="tel"
                  value={formData.homeownerPhone}
                  onChange={(e) => handleInputChange('homeownerPhone', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.homeownerPhone ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.homeownerPhone && <p className="text-red-400 text-sm mt-1">{errors.homeownerPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assign Contractor (Optional)
                </label>
                <select
                  value={formData.contractorId}
                  onChange={(e) => handleInputChange('contractorId', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
                >
                  <option value="">Select a contractor</option>
                  {contractors
                    .filter(contractor => contractor.specialties.includes(formData.type))
                    .map(contractor => (
                      <option key={contractor.id} value={contractor.id}>
                        {contractor.name} (★ {contractor.rating})
                      </option>
                    ))}
                </select>
                <p className="text-gray-400 text-sm mt-1">
                  Showing contractors specialized in {formData.type}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Timeline & Budget */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Timeline & Budget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.startDate ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Completion *
                </label>
                <input
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={(e) => handleInputChange('estimatedCompletion', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-green ${
                    errors.estimatedCompletion ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.estimatedCompletion && <p className="text-red-400 text-sm mt-1">{errors.estimatedCompletion}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Cost *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.estimatedCost || ''}
                    onChange={(e) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                    className={`w-full pl-8 pr-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green ${
                      errors.estimatedCost ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter estimated project cost"
                  />
                </div>
                {errors.estimatedCost && <p className="text-red-400 text-sm mt-1">{errors.estimatedCost}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Additional Details</h2>
            
            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Project Milestones</h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Milestone</span>
                </button>
              </div>
              
              {formData.milestones.length === 0 ? (
                <div className="bg-dark-primary rounded-lg p-6 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No milestones added yet. Add milestones to track project progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="bg-dark-primary rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium">Milestone {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-secondary border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green"
                            placeholder="Milestone title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Target Date</label>
                          <input
                            type="date"
                            value={milestone.date}
                            onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                            min={formData.startDate}
                            max={formData.estimatedCompletion}
                            className="w-full px-3 py-2 bg-dark-secondary border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-accent-green"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">Description</label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-dark-secondary border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-green"
                            placeholder="Milestone description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Project Documents</h3>
                <div className="bg-dark-primary rounded-lg p-6 border-2 border-dashed border-gray-600 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Upload project documents</p>
                  <p className="text-gray-500 text-sm">Contracts, permits, specifications, etc.</p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Choose Files
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Project Images</h3>
                <div className="bg-dark-primary rounded-lg p-6 border-2 border-dashed border-gray-600 text-center">
                  <PhotoIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Upload project images</p>
                  <p className="text-gray-500 text-sm">Before photos, damage assessment, etc.</p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Choose Images
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
              currentStep === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowLeftIcon className="h-5 w-5 rotate-180" />
            </button>
          ) : (
            <div className="flex flex-col items-end space-y-2">
              {errors.submit && (
                <div className="flex items-center space-x-2 bg-red-900/20 border border-red-500 rounded-lg px-4 py-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{errors.submit}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-accent-green hover:bg-green-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Project...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}