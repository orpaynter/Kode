import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PhotoIcon,
  XMarkIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { FormData } from '../types';

type UserRole = 'homeowner' | 'contractor' | 'insurance' | 'supplier';

export function AssessmentForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'homeowner',
    address: '',
    images: [],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'homeowner',
      label: 'Homeowner',
      description: 'Property owner seeking roof assessment'
    },
    {
      value: 'contractor',
      label: 'Contractor',
      description: 'Roofing professional or contractor'
    },
    {
      value: 'insurance',
      label: 'Insurance Professional',
      description: 'Insurance adjuster or agent'
    },
    {
      value: 'supplier',
      label: 'Material Supplier',
      description: 'Roofing material supplier or distributor'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 10) // Max 10 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Please upload at least one roof image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/register', { 
          state: { 
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            role: formData.role
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Assessment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-accent-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-8 w-8 text-accent-green" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Assessment Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for submitting your roof assessment. Our AI is processing your images and will have results ready shortly.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting you to create an account to view your results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <span className="text-white font-bold text-lg">OrPaynter AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI Roof Assessment
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload photos of your roof and get an instant AI-powered damage analysis. 
            Our advanced technology will identify issues and provide detailed recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                Property Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                  errors.address ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter the property address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Role Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {roleOptions.map(option => (
                <div
                  key={option.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.role === option.value
                      ? 'border-accent-blue bg-accent-blue bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleInputChange}
                      className="mr-3 text-accent-blue"
                    />
                    <h3 className="font-semibold text-white">{option.label}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Roof Images *</h2>
            <p className="text-gray-300 mb-6">
              Upload clear photos of your roof from different angles. Include close-ups of any visible damage.
            </p>
            
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.images ? 'border-red-500' : 'border-gray-600 hover:border-accent-blue'
                }`}
              >
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Click to upload roof images</p>
                <p className="text-sm text-gray-400">
                  Supports: JPG, PNG, WebP (Max 10MB each, up to 10 images)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              {errors.images && (
                <p className="text-sm text-red-400 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.images}
                </p>
              )}
              
              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Roof image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Additional Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              placeholder="Describe any specific concerns, recent weather damage, or areas of interest..."
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-4 bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Assessment...
                </>
              ) : (
                'Submit for AI Analysis'
              )}
            </button>
            
            <p className="text-sm text-gray-400 mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy.
              Your assessment will be processed using our AI technology.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}