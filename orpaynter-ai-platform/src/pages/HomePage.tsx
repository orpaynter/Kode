import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  CameraIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
interface TrustMetrics {
  accuracy_percentage: number;
  revenue_impact: string;
  total_scans: number;
  customer_satisfaction: number;
}

export function HomePage() {
  const trustMetrics: TrustMetrics = {
    accuracy_percentage: 97.8,
    revenue_impact: '$2.3M',
    total_scans: 15420,
    customer_satisfaction: 4.9
  };

  const features = [
    {
      icon: CameraIcon,
      title: 'AI-Powered Analysis',
      description: 'Upload photos and get instant roof damage assessment using advanced AI technology.'
    },
    {
      icon: ChartBarIcon,
      title: 'Detailed Reports',
      description: 'Comprehensive damage analysis with repair recommendations and cost estimates.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Insurance Ready',
      description: 'Generate professional reports that insurance companies trust and accept.'
    },
    {
      icon: ClockIcon,
      title: 'Instant Results',
      description: 'Get your roof assessment results in minutes, not days or weeks.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      content: 'OrPaynter helped me get my insurance claim approved in just 3 days. The AI analysis was spot-on!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Roofing Contractor',
      content: 'This platform has revolutionized how I assess properties. My clients love the detailed reports.',
      rating: 5
    },
    {
      name: 'Jennifer Chen',
      role: 'Insurance Adjuster',
      content: 'The accuracy of OrPaynter\'s assessments has streamlined our claims process significantly.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <span className="text-white font-bold text-xl">OrPaynter AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-accent-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Roof
              <span className="block bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform roof assessments with cutting-edge AI technology. Get instant damage analysis, 
              professional reports, and streamlined insurance claims processing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment"
                className="inline-flex items-center px-8 py-4 bg-accent-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors group"
              >
                Start Free Assessment
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white font-semibold rounded-lg transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-blue opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple opacity-10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="bg-dark-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-300">Join thousands of professionals who rely on our AI-powered platform</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-blue mb-2">
                {trustMetrics.accuracy_percentage}%
              </div>
              <div className="text-gray-300 text-sm">AI Accuracy Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-green mb-2">
                {trustMetrics.revenue_impact}
              </div>
              <div className="text-gray-300 text-sm">Revenue Impact</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-purple mb-2">
                {trustMetrics.total_scans.toLocaleString()}+
              </div>
              <div className="text-gray-300 text-sm">Roofs Analyzed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-orange mb-2">
                {trustMetrics.customer_satisfaction}/5
              </div>
              <div className="text-gray-300 text-sm">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Revolutionary Roof Assessment Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of roof inspections with our AI-powered platform designed for 
              homeowners, contractors, and insurance professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-dark-secondary p-6 rounded-xl border border-gray-700 hover:border-accent-blue transition-colors">
                  <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-accent-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-dark-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Don't just take our word for it - hear from professionals who use OrPaynter daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-dark-primary p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircleIcon key={i} className="h-5 w-5 text-accent-green" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Roof Assessments?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who trust OrPaynter for accurate, fast, and reliable roof analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/assessment"
              className="inline-flex items-center px-8 py-4 bg-accent-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors group"
            >
              Try Free Assessment
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white font-semibold rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-secondary border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OP</span>
                </div>
                <span className="text-white font-bold text-lg">OrPaynter AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionary AI-powered roof intelligence platform for the modern construction industry.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/assessment" className="hover:text-white transition-colors">AI Assessment</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/subscription" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 OrPaynter AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}