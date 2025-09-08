import React from 'react';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  const suggestions = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Assessment Form', path: '/assessment', icon: '📋' },
    { label: 'Projects', path: '/projects', icon: '🔨' },
    { label: 'Billing', path: '/billing', icon: '💳' },
    { label: 'Support', path: '/support', icon: '🆘' }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-[#58A6FF] mb-4 opacity-20">
            404
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#58A6FF] to-purple-500 rounded-full blur-3xl opacity-20 w-32 h-32 mx-auto"></div>
            <HelpCircle className="w-32 h-32 text-[#58A6FF] mx-auto relative z-10" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#161B22] border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-[#21262D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#58A6FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Quick Navigation */}
        <div className="bg-[#161B22] border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Quick Navigation
          </h3>
          <p className="text-gray-400 mb-6">
            Here are some popular pages you might be looking for:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 p-3 bg-[#0D1117] border border-gray-600 rounded-lg hover:border-[#58A6FF] hover:bg-[#58A6FF]/5 transition-colors group"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-300 group-hover:text-[#58A6FF] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Still can't find what you're looking for?
          </p>
          <Link
            to="/support"
            className="text-[#58A6FF] hover:text-blue-400 transition-colors text-sm"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}