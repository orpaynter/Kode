import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ArrowLeftIcon, 
  CreditCardIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const PaymentErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [errorType] = useState(searchParams.get('error') || 'generic');
  const [sessionId] = useState(searchParams.get('session_id'));

  const getErrorDetails = (type: string) => {
    switch (type) {
      case 'card_declined':
        return {
          title: 'Payment Declined',
          message: 'Your card was declined. Please check your card details or try a different payment method.',
          suggestions: [
            'Verify your card number, expiry date, and CVV',
            'Check if your card has sufficient funds',
            'Contact your bank to ensure international transactions are enabled',
            'Try using a different credit or debit card',
          ],
        };
      case 'insufficient_funds':
        return {
          title: 'Insufficient Funds',
          message: 'Your card does not have sufficient funds to complete this transaction.',
          suggestions: [
            'Add funds to your account',
            'Try using a different payment method',
            'Contact your bank for assistance',
          ],
        };
      case 'expired_card':
        return {
          title: 'Card Expired',
          message: 'The card you are trying to use has expired.',
          suggestions: [
            'Use a card that has not expired',
            'Contact your bank to get a new card',
            'Try using a different payment method',
          ],
        };
      case 'processing_error':
        return {
          title: 'Processing Error',
          message: 'There was an error processing your payment. This is usually temporary.',
          suggestions: [
            'Wait a few minutes and try again',
            'Check your internet connection',
            'Try using a different browser',
            'Contact support if the problem persists',
          ],
        };
      case 'canceled':
        return {
          title: 'Payment Canceled',
          message: 'You canceled the payment process. No charges were made to your account.',
          suggestions: [
            'Return to pricing to select a plan',
            'Contact support if you need assistance',
          ],
        };
      default:
        return {
          title: 'Payment Failed',
          message: 'We encountered an issue processing your payment. Please try again.',
          suggestions: [
            'Check your payment details and try again',
            'Try using a different payment method',
            'Contact support for assistance',
          ],
        };
    }
  };

  const errorDetails = getErrorDetails(errorType);

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {errorDetails.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            {errorDetails.message}
          </p>

          {/* Error Details */}
          {sessionId && (
            <div className="bg-[#0D1117] rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-400">
                Session ID: <span className="font-mono text-gray-300">{sessionId}</span>
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-[#0D1117] rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">What you can do:</h2>
            <ul className="space-y-3">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 bg-[#58A6FF] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#58A6FF] text-white font-medium rounded-lg hover:bg-[#4A90E2] transition-colors"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Try Again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Support Options */}
          <div className="border-t border-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:support@orpaynter.com"
                className="flex items-center justify-center p-4 bg-[#0D1117] rounded-lg border border-gray-600 hover:border-[#58A6FF] transition-colors group"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 group-hover:text-[#58A6FF] mr-2" />
                <span className="text-gray-300 group-hover:text-white">Email Support</span>
              </a>
              <a
                href="tel:+1-555-0123"
                className="flex items-center justify-center p-4 bg-[#0D1117] rounded-lg border border-gray-600 hover:border-[#58A6FF] transition-colors group"
              >
                <PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-[#58A6FF] mr-2" />
                <span className="text-gray-300 group-hover:text-white">Call Support</span>
              </a>
            </div>
          </div>

          {/* Common Issues */}
          <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-300 mb-2">💡 Common Issues</h4>
            <p className="text-sm text-yellow-200">
              Most payment issues are resolved by using a different card or contacting your bank. 
              International cards may need to be enabled for online transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;