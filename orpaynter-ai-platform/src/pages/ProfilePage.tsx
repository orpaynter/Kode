import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Building, Camera, Save } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    bio: user?.bio || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#161B22] border border-gray-700 rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#58A6FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-[#58A6FF] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#58A6FF] p-2 rounded-full text-white hover:bg-blue-600">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white mt-4">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
                        />
                      </div>
                    ) : (
                      <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3">
                        {formData.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
                        />
                      </div>
                    ) : (
                      <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3">
                        {formData.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
                      />
                    </div>
                  ) : (
                    <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3">
                      {formData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
                        placeholder="Enter phone number"
                      />
                    </div>
                  ) : (
                    <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3">
                      {formData.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                {(user?.role === 'contractor' || user?.role === 'insurance' || user?.role === 'supplier') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
                          placeholder="Enter company name"
                        />
                      </div>
                    ) : (
                      <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3">
                        {formData.company || 'Not provided'}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white bg-[#0D1117] border border-gray-600 rounded-lg px-4 py-3 min-h-[100px]">
                      {formData.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-[#58A6FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}