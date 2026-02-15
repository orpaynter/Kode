import { useState, useEffect } from 'react'
import { CreditCard, Check, Award, Key, Shield, AlertCircle } from 'lucide-react'
import { subscriptionPlans, createCheckoutSession, getUserSubscription } from '../../services/stripe'
import { getAIServiceStatus, validateOpenAIKey } from '../../services/openai'
import { useAppStore } from '../../store'

const Settings = () => {
  const { user, setUser } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [apiKey, setApiKey] = useState('')
  const [apiKeyValid, setApiKeyValid] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [aiServiceStatus, setAiServiceStatus] = useState(getAIServiceStatus())
  
  useEffect(() => {
    // For demo purposes, simulate a user being logged in with a subscription
    if (!user.name) {
      setUser({
        name: 'Demo User',
        email: 'Oliver@orpaynter.com',
        licenseType: 'professional',
        isAuthenticated: true
      })
    }
    
    // Simulate loading the user's subscription
    const loadSubscription = async () => {
      if (user.email) {
        try {
          const sub = await getUserSubscription(user.email)
          setSubscription(sub)
        } catch (error) {
          console.error('Failed to load subscription:', error)
        }
      }
    }
    
    loadSubscription()
  }, [user.email, setUser])
  
  const handleUpgrade = async (planId: string) => {
    if (!user.email) return
    
    setLoading(true)
    try {
      const { sessionUrl } = await createCheckoutSession(planId, user.email)
      // In a real app, we would redirect to the Stripe checkout page
      // window.location.href = sessionUrl
      
      // For demo purposes, just show a success message and update the user's license type
      setTimeout(() => {
        setUser({ licenseType: planId as any })
        setLoading(false)
        // Show a celebratory message or animation
        alert(`Successfully upgraded to ${planId} plan! In a real app, this would redirect to Stripe.`)
      }, 1500)
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      setLoading(false)
    }
  }
  
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey)
    const isValid = validateOpenAIKey(newApiKey)
    setApiKeyValid(isValid)
    
    if (isValid) {
      // In a real app, this would securely store the API key
      localStorage.setItem('TAURI_OPENAI_API_KEY', newApiKey)
      setAiServiceStatus(getAIServiceStatus())
    }
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      
      <div className="glass-panel p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email || 'Not set'}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-orpaynter-deep-blue" />
          AI Service Configuration
        </h3>
        
        <div className="mb-4">
          <div className={`flex items-center p-3 rounded-lg mb-4 ${
            aiServiceStatus.serviceMode === 'production' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Status: {aiServiceStatus.serviceMode === 'production' ? 'Production Mode (Real AI)' : 'Simulation Mode (Demo)'}
            </span>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              OpenAI API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className={`w-full p-3 border rounded-lg pr-20 ${
                  apiKey ? (apiKeyValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-orpaynter-deep-blue hover:text-orpaynter-deep-blue/80"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {apiKey && (
              <div className={`flex items-center text-sm ${
                apiKeyValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {apiKeyValid ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-1" />
                )}
                {apiKeyValid ? 'Valid API key format' : 'Invalid API key format'}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Add your OpenAI API key to enable real AI-powered roof damage assessment. 
              Without an API key, the app will use simulation mode for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Subscription Plan</h3>
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-orpaynter-deep-blue" />
            <span className="text-sm font-medium capitalize">{user.licenseType || 'Basic'} License</span>
          </div>
        </div>
        
        {subscription && (
          <div className="bg-white/50 p-4 rounded-lg mb-6">
            <p className="text-sm">Your {subscription.planId} plan will renew on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = user.licenseType === plan.id
            
            return (
              <div 
                key={plan.id}
                className={`rounded-lg p-4 ${isCurrentPlan 
                  ? 'border-2 border-orpaynter-deep-blue bg-blue-50' 
                  : 'border border-gray-200 bg-white/80'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{plan.name}</h4>
                  {isCurrentPlan && (
                    <span className="text-xs bg-orpaynter-deep-blue text-white px-2 py-1 rounded-full">Current</span>
                  )}
                </div>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg ${isCurrentPlan
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-orpaynter-deep-blue text-white hover:bg-orpaynter-deep-blue/90'}`}
                  disabled={isCurrentPlan || loading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Upgrade'}
                </button>
              </div>
            )
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          All plans include automatic updates and security improvements. For enterprise needs or custom integrations, please contact our sales team.
        </p>
      </div>
    </div>
  )
}

export default Settings
