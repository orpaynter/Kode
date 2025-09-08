import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, FileText, Send, Clock, CheckCircle } from 'lucide-react';

export function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'technical', label: 'Technical Issues', icon: '🔧' },
    { id: 'billing', label: 'Billing & Payments', icon: '💳' },
    { id: 'account', label: 'Account Management', icon: '👤' },
    { id: 'feature', label: 'Feature Request', icon: '💡' },
    { id: 'other', label: 'Other', icon: '❓' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#161B22] border border-gray-700 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Support Request Submitted</h2>
            <p className="text-gray-400 mb-6">
              Thank you for contacting us. We've received your support request and will get back to you within 24 hours.
            </p>
            <div className="bg-[#0D1117] border border-gray-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                <strong>Ticket ID:</strong> #SUP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ subject: '', message: '', priority: 'medium' });
                setSelectedCategory('');
              }}
              className="bg-[#58A6FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-gray-400">Get help with your OrPaynter account and services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="lg:col-span-1">
            <div className="bg-[#161B22] border border-gray-700 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Contact Options</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[#58A6FF]" />
                  <div>
                    <p className="text-white font-medium">Live Chat</p>
                    <p className="text-sm text-gray-400">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-lg">
                  <Phone className="w-5 h-5 text-[#58A6FF]" />
                  <div>
                    <p className="text-white font-medium">Phone Support</p>
                    <p className="text-sm text-gray-400">Mon-Fri 9AM-6PM EST</p>
                    <p className="text-sm text-[#58A6FF]">1-800-ORPAYNTER</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-lg">
                  <Mail className="w-5 h-5 text-[#58A6FF]" />
                  <div>
                    <p className="text-white font-medium">Email Support</p>
                    <p className="text-sm text-gray-400">Response within 24 hours</p>
                    <p className="text-sm text-[#58A6FF]">support@orpaynter.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-[#58A6FF] hover:text-blue-400 transition-colors">
                  📚 Knowledge Base
                </a>
                <a href="#" className="block text-[#58A6FF] hover:text-blue-400 transition-colors">
                  🎥 Video Tutorials
                </a>
                <a href="#" className="block text-[#58A6FF] hover:text-blue-400 transition-colors">
                  ❓ FAQ
                </a>
                <a href="#" className="block text-[#58A6FF] hover:text-blue-400 transition-colors">
                  📋 System Status
                </a>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#161B22] border border-gray-700 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Submit a Support Request</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'border-[#58A6FF] bg-[#58A6FF]/10 text-[#58A6FF]'
                            : 'border-gray-600 bg-[#0D1117] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-lg mb-1">{category.icon}</div>
                        <div className="text-sm font-medium">{category.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Standard issue</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - System down</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent resize-none"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Expected response time: 24 hours</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedCategory}
                  className="w-full bg-[#58A6FF] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}