// This file would handle Stripe API integration in a production app
// For the demo, we'll simulate the API calls

/**
 * Simulated subscription plans
 */
export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19.99,
    interval: 'month',
    features: [
      'Unlimited roof assessments',
      'Basic lead qualification',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49.99,
    interval: 'month',
    features: [
      'Unlimited roof assessments',
      'Advanced lead qualification',
      'CRM integration',
      'Priority email support',
      'Team collaboration (up to 3 users)'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    interval: 'month',
    features: [
      'Unlimited roof assessments',
      'Advanced lead qualification with scoring',
      'Custom CRM integration',
      '24/7 priority support',
      'Unlimited team collaboration',
      'White-label reports'
    ]
  }
]

/**
 * Creates a subscription checkout session
 * In a real app, this would call the Stripe API
 * @param planId The selected plan ID
 * @param userEmail User's email for the subscription
 */
export const createCheckoutSession = async (planId: string, userEmail: string): Promise<{ sessionUrl: string }> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would create a checkout session with Stripe
  // and return the session URL for redirection
  
  // For demo purposes, just return a simulated success
  return {
    sessionUrl: `https://checkout.stripe.com/pay/simulated-session-${planId}-${Date.now()}`
  }
}

/**
 * Gets the current subscription for a user
 * In a real app, this would query the Stripe API
 * @param userEmail User's email to look up
 */
export const getUserSubscription = async (userEmail: string) => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For demo purposes, return a simulated subscription
  // In a real app, this would query Stripe for actual subscription data
  return {
    id: `sub_${Date.now()}`,
    status: 'active',
    planId: 'professional',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    cancelAtPeriodEnd: false
  }
}
