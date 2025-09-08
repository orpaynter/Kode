import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useStripe } from '../contexts/StripeContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const { subscriptionTiers, createCheckoutSession } = useStripe();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = async (priceId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    await createCheckoutSession(priceId);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the perfect plan for your property assessment needs. 
            Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(subscriptionTiers).map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-gradient-to-b from-[#58A6FF]/20 to-[#161B22] border-2 border-[#58A6FF]'
                  : 'bg-[#161B22] border border-gray-700'
              } hover:border-[#58A6FF] transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#58A6FF] text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-[#58A6FF] mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(tier.priceId)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  tier.popular
                    ? 'bg-[#58A6FF] text-white hover:bg-[#4A90E2] shadow-lg'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {user ? 'Select Plan' : 'Sign Up & Select'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#161B22] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-[#161B22] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-300">
                We accept all major credit cards, debit cards, and ACH bank transfers through our secure Stripe integration.
              </p>
            </div>
            <div className="bg-[#161B22] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-300">
                Yes, all plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-[#161B22] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What happens if I exceed my assessment limit?
              </h3>
              <p className="text-gray-300">
                You'll be notified when approaching your limit and can upgrade your plan or purchase additional assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-4">
            Need a custom plan for your organization?
          </p>
          <button className="bg-[#58A6FF] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4A90E2] transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;