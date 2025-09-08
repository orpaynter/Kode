import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Stripe configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 29,
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      'Up to 5 AI assessments per month',
      'Basic damage analysis',
      'Email support',
      'Mobile app access'
    ],
    popular: false
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 79,
    priceId: 'price_professional_monthly', // Replace with actual Stripe price ID
    features: [
      'Up to 25 AI assessments per month',
      'Advanced damage analysis',
      'Priority support',
      'Project management tools',
      'Contractor network access',
      'Insurance claim assistance'
    ],
    popular: true
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited AI assessments',
      'Premium damage analysis',
      '24/7 phone support',
      'Advanced project management',
      'Priority contractor matching',
      'Dedicated account manager',
      'Custom integrations',
      'White-label options'
    ],
    popular: false
  }
};

interface StripeContextType {
  stripe: Promise<Stripe | null>;
  subscriptionTiers: typeof SUBSCRIPTION_TIERS;
  createCheckoutSession: (priceId: string) => Promise<void>;
  createPortalSession: () => Promise<void>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const createCheckoutSession = async (priceId: string) => {
    try {
      // This would typically call your backend API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // For demo purposes, show alert
      alert('Payment functionality requires backend integration. This is a demo.');
    }
  };

  const createPortalSession = async () => {
    try {
      // This would typically call your backend API to create a portal session
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/billing`,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      // For demo purposes, show alert
      alert('Billing portal requires backend integration. This is a demo.');
    }
  };

  const value = {
    stripe: stripePromise,
    subscriptionTiers: SUBSCRIPTION_TIERS,
    createCheckoutSession,
    createPortalSession,
  };

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};