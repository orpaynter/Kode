// Stripe utility functions for client-side operations
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export { stripePromise };

// Subscription tier configurations
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      '5 AI Assessments per month',
      'Basic damage detection',
      'Email support',
      'Mobile app access',
    ],
    stripePriceId: 'price_basic_monthly', // Replace with actual Stripe price ID
  },
  professional: {
    name: 'Professional',
    price: 79,
    interval: 'month',
    features: [
      '25 AI Assessments per month',
      'Advanced damage analysis',
      'Priority support',
      'Project management tools',
      'Contractor network access',
      'Insurance integration',
    ],
    stripePriceId: 'price_professional_monthly', // Replace with actual Stripe price ID
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited AI Assessments',
      'Custom AI model training',
      'Dedicated account manager',
      'API access',
      'White-label solutions',
      'Advanced analytics',
      'Custom integrations',
    ],
    stripePriceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// API endpoints for Stripe operations
export const STRIPE_API_ENDPOINTS = {
  createCheckoutSession: '/api/stripe/create-checkout-session',
  createPortalSession: '/api/stripe/create-portal-session',
  webhook: '/api/stripe/webhook',
  getSubscription: '/api/stripe/subscription',
  cancelSubscription: '/api/stripe/cancel-subscription',
} as const;

// Helper function to create checkout session
export const createCheckoutSession = async (priceId: string, customerId?: string) => {
  try {
    const response = await fetch(STRIPE_API_ENDPOINTS.createCheckoutSession, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Helper function to create portal session
export const createPortalSession = async (customerId: string) => {
  try {
    const response = await fetch(STRIPE_API_ENDPOINTS.createPortalSession, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/billing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Helper function to get subscription details
export const getSubscriptionDetails = async (customerId: string) => {
  try {
    const response = await fetch(`${STRIPE_API_ENDPOINTS.getSubscription}?customerId=${customerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get subscription details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};