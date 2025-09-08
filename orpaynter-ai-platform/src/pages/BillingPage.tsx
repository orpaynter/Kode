import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../contexts/StripeContext';
import {
  CreditCardIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  amount: number;
  interval: 'month' | 'year';
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const { createPortalSession, subscriptionTiers } = useStripe();
  const [activeTab, setActiveTab] = useState<'overview' | 'payment-methods' | 'invoices'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const [subscription] = useState<Subscription>({
    id: 'sub_1234567890',
    planName: 'Professional',
    status: 'active',
    currentPeriodEnd: '2024-02-15',
    amount: 79,
    interval: 'month',
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1234567890',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: 'in_1234567890',
      date: '2024-01-15',
      amount: 79,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'in_0987654321',
      date: '2023-12-15',
      amount: 79,
      status: 'paid',
      downloadUrl: '#',
    },
  ]);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      await createPortalSession();
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'text-green-400';
      case 'trialing':
        return 'text-blue-400';
      case 'past_due':
      case 'failed':
        return 'text-red-400';
      case 'canceled':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'past_due':
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
          <p className="text-gray-300">Manage your subscription, payment methods, and billing history</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
              { id: 'payment-methods', name: 'Payment Methods', icon: CreditCardIcon },
              { id: 'invoices', name: 'Invoices', icon: CalendarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#58A6FF] text-[#58A6FF]'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Subscription */}
            <div className="bg-[#161B22] rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Current Subscription</h2>
                <button
                  onClick={handleManageBilling}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-[#58A6FF] text-white rounded-lg hover:bg-[#4A90E2] disabled:opacity-50 transition-colors"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
                  {isLoading ? 'Loading...' : 'Manage Billing'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Plan</p>
                  <p className="text-lg font-medium text-white">{subscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <div className="flex items-center">
                    {getStatusIcon(subscription.status)}
                    <span className={`ml-2 capitalize ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                  <p className="text-lg font-medium text-white">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#0D1117] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Subscription</span>
                  <span className="text-2xl font-bold text-white">${subscription.amount}</span>
                </div>
              </div>
            </div>

            {/* Usage Summary */}
            <div className="bg-[#161B22] rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Usage This Month</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#58A6FF] mb-2">12</p>
                  <p className="text-sm text-gray-400">AI Assessments Used</p>
                  <p className="text-xs text-gray-500">of 25 included</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#58A6FF] mb-2">3</p>
                  <p className="text-sm text-gray-400">Active Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#58A6FF] mb-2">8</p>
                  <p className="text-sm text-gray-400">Support Tickets</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
                <button
                  onClick={handleManageBilling}
                  className="px-4 py-2 bg-[#58A6FF] text-white rounded-lg hover:bg-[#4A90E2] transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-8 w-8 text-gray-400 mr-4" />
                      <div>
                        <p className="text-white font-medium">
                          {method.brand.toUpperCase()} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-400">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="px-3 py-1 bg-[#58A6FF] text-white text-sm rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Invoice History</h2>
              
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-4" />
                      <div>
                        <p className="text-white font-medium">
                          Invoice #{invoice.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-white font-medium">${invoice.amount}</p>
                        <div className="flex items-center">
                          {getStatusIcon(invoice.status)}
                          <span className={`ml-1 text-sm capitalize ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default B