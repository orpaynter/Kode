import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [sessionId] = useState(searchParams.get('session_id'));
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // In a real app, you would verify the payment with your backend
    const verifyPayment = async () => {
      try {
        if (sessionId) {
          // Mock payment verification - replace with actual API call
          setTimeout(() => {
            setPaymentDetails({
              amount: 79,
              currency: 'USD',
              planName: 'Professional',
              customerEmail: user?.email || 'user@example.com',
            });
            setIsLoading(false);
          }, 1500);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58A6FF] mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Thank you for subscribing to OrPaynter AI. Your account has been upgraded successfully.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-[#0D1117] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-white font-medium">{paymentDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">
                    ${paymentDetails.amount} {paymentDetails.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-medium">{paymentDetails.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-[#0D1117] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Your account has been upgraded to Professional</span>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">You now have access to 25 AI assessments per month</span>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Priority support is now available</span>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Project management tools are unlocked</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#58A6FF] text-white font-medium rounded-lg hover:bg-[#4A90E2] transition-colors"
            >
              Go to Dashboard
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/billing"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Manage Billing
            </Link>
          </div>

          {/* Receipt Notice */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-300">
              📧 A receipt has been sent to your email address. You can also download invoices from your billing page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;