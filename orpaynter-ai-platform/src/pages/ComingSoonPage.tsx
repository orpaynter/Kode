import React, { useState } from 'react';
import { Clock, Bell, ArrowRight, CheckCircle } from 'lucide-react';

interface ComingSoonPageProps {
  feature?: string;
  description?: string;
  estimatedDate?: string;
}

export function ComingSoonPage({ 
  feature = "New Feature", 
  description = "We're working hard to bring you something amazing.", 
  estimatedDate = "Q2 2024" 
}: ComingSoonPageProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
  };

  const features = [
    {
      title: "AI-Powered Damage Assessment",
      description: "Advanced machine learning algorithms for accurate property damage analysis",
      status: "In Development"
    },
    {
      title: "Real-time Collaboration Tools",
      description: "Enhanced communication features for seamless project coordination",
      status: "Coming Soon"
    },
    {
      title: "Mobile App",
      description: "Native iOS and Android applications for on-the-go access",
      status: "Planned"
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive insights and reporting for better decision making",
      status: "In Development"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#161B22] border border-gray-700 rounded-full px-4 py-2 mb-6">
            <Clock className="w-4 h-4 text-[#58A6FF]" />
            <span className="text-sm text-gray-300">Expected: {estimatedDate}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {feature}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Notification Signup */}
        <div className="bg-[#161B22] border border-gray-700 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <Bell className="w-12 h-12 text-[#58A6FF] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Get Notified When It's Ready</h2>
            <p className="text-gray-400">
              Be the first to know when this feature launches. We'll send you an email as soon as it's available.
            </p>
          </div>

          {isSubscribed ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">You're All Set!</h3>
              <p className="text-gray-400">
                We'll notify you at <span className="text-[#58A6FF]">{email}</span> when this feature is ready.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#58A6FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Roadmap */}
        <div className="bg-[#161B22] border border-gray-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">What's Coming Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div key={index} className="bg-[#0D1117] border border-gray-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'In Development' 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : item.status === 'Coming Soon'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[#58A6FF] hover:text-blue-400 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}