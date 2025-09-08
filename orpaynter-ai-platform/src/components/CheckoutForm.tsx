import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  planName: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  amount,
  planName,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        navigate('/payment/success', {
          state: {
            paymentIntent,
            planName,
            amount,
          },
        });
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-300">
              You're subscribing to the <span className="text-[#58A6FF] font-semibold">{planName}</span> plan
            </p>
            <div className="mt-4 p-4 bg-[#0D1117] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{planName} Plan</span>
                <span className="text-2xl font-bold text-white">${amount}/month</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Information
              </label>
              <div className="p-4 bg-[#0D1117] rounded-lg border border-gray-600">
                <PaymentElement
                  options={{
                    layout: 'tabs',
                    paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
                  }}
                />
              </div>
            </div>

            {/* Address Element */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Billing Address
              </label>
              <div className="p-4 bg-[#0D1117] rounded-lg border border-gray-600">
                <AddressElement
                  options={{
                    mode: 'billing',
                    allowedCountries: ['US', 'CA'],
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || !elements || isLoading}
              className="w-full bg-[#58A6FF] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#4A90E2] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                `Subscribe for $${amount}/month`
              )}
            </button>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              By completing this purchase, you agree to our{' '}
              <a href="/terms" className="text-[#58A6FF] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#58A6FF] hover:underline">
                Privacy Policy
              </a>
              . Your subscription will automatically renew monthly.
            </p>
          </div>
        </div>
      </div>
    </div