import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Check,
  Zap,
  Crown,
  Star,
  BarChart3,
  Users,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
  current?: boolean
  monthlyLimit: number
  icon: React.ComponentType<any>
  color: string
}

interface UsageStats {
  current_usage: number
  monthly_limit: number
  period_start: string
  period_end: string
  overage_fee: number
}

interface BillingHistory {
  id: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  invoice_url?: string
}

export function Billing() {
  const { user, profile } = useAuth()
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [usage, setUsage] = useState<UsageStats>({
    current_usage: 0,
    monthly_limit: 50,
    period_start: '',
    period_end: '',
    overage_fee: 0
  })
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [changingPlan, setChangingPlan] = useState(false)

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      interval: 'month',
      monthlyLimit: 25,
      icon: Zap,
      color: 'border-blue-500/50 bg-blue-500/10',
      features: [
        '25 AI analyses per month',
        'Basic damage detection',
        'Cost estimation',
        'Email support',
        'Mobile app access'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 299,
      interval: 'month',
      monthlyLimit: 100,
      popular: true,
      icon: Crown,
      color: 'border-purple-500/50 bg-purple-500/10',
      features: [
        '100 AI analyses per month',
        'Advanced damage detection',
        'Detailed cost breakdown',
        'Insurance claim support',
        'Priority support',
        'API access',
        'Custom reports'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      interval: 'month',
      monthlyLimit: 500,
      icon: Star,
      color: 'border-yellow-500/50 bg-yellow-500/10',
      features: [
        '500 AI analyses per month',
        'Premium AI models',
        'Advanced analytics',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Training & onboarding',
        'SLA guarantee'
      ]
    }
  ]

  useEffect(() => {
    if (user) {
      loadBillingData()
    }
  }, [user])

  async function loadBillingData() {
    try {
      setLoading(true)
      
      // Load current subscription
      const { data: subscription } = await supabase
        .from('orpaynter_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single()

      // Set current plan or default to starter
      let current = plans.find(p => p.id === 'professional') || plans[0]
      if (subscription) {
        const planType = subscription.price_id.includes('professional') ? 'professional' :
                        subscription.price_id.includes('enterprise') ? 'enterprise' : 'starter'
        current = plans.find(p => p.id === planType) || plans[0]
      }
      current.current = true
      setCurrentPlan(current)

      // Set usage stats
      const now = new Date()
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      setUsage({
        current_usage: 23, // Mock data
        monthly_limit: current.monthlyLimit,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        overage_fee: 0
      })

      // Load billing history (mock data)
      setBillingHistory([
        {
          id: '1',
          date: '2024-08-01',
          description: 'Professional Plan - Monthly',
          amount: 299,
          status: 'paid',
          invoice_url: '#'
        },
        {
          id: '2',
          date: '2024-07-01',
          description: 'Professional Plan - Monthly',
          amount: 299,
          status: 'paid',
          invoice_url: '#'
        },
        {
          id: '3',
          date: '2024-06-01',
          description: 'Starter Plan - Monthly',
          amount: 99,
          status: 'paid',
          invoice_url: '#'
        }
      ])
    } catch (error) {
      console.error('Error loading billing data:', error)
      toast.error('Failed to load billing information')
    } finally {
      setLoading(false)
    }
  }

  async function changePlan(planId: string) {
    if (changingPlan || currentPlan?.id === planId) return

    setChangingPlan(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { 
          planType: planId, 
          customerEmail: user?.email 
        }
      })

      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
      } else {
        toast.success(`Successfully switched to ${planId} plan!`)
        // Reload to show updated status
        loadBillingData()
      }
    } catch (error: any) {
      console.error('Plan change error:', error)
      toast.error('Failed to change plan: ' + (error.message || 'Unknown error'))
    } finally {
      setChangingPlan(false)
    }
  }

  const getUsagePercentage = () => {
    return Math.min((usage.current_usage / usage.monthly_limit) * 100, 100)
  }

  const getUsageColor = () => {
    const percentage = getUsagePercentage()
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle
      case 'pending': return AlertCircle
      case 'failed': return AlertCircle
      default: return AlertCircle
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your subscription and billing information</p>
      </motion.div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Current Plan</h3>
          {currentPlan && (
            <div className={`border-2 rounded-xl p-6 ${currentPlan.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <currentPlan.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{currentPlan.name}</h4>
                    <p className="text-gray-300">{formatCurrency(currentPlan.price)}/month</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Monthly Limit</p>
                  <p className="text-2xl font-bold text-white">{currentPlan.monthlyLimit}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-300 mb-3">Plan includes:</p>
                {currentPlan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Usage This Month</h3>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {usage.current_usage} / {usage.monthly_limit}
              </p>
              <p className="text-gray-400">AI Analyses Used</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{Math.round(getUsagePercentage())}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getUsageColor()}`}
                  style={{ width: `${getUsagePercentage()}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-sm text-gray-400">Period Start</p>
                <p className="text-white font-medium">{formatDate(usage.period_start)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Resets On</p>
                <p className="text-white font-medium">{formatDate(usage.period_end)}</p>
              </div>
            </div>
            
            {getUsagePercentage() > 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <p className="text-yellow-400 font-medium">Usage Warning</p>
                </div>
                <p className="text-sm text-yellow-300 mt-1">
                  You've used {Math.round(getUsagePercentage())}% of your monthly limit. Consider upgrading to avoid overage fees.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = currentPlan?.id === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 transition-all ${
                  isCurrent
                    ? plan.color
                    : plan.popular
                    ? 'border-purple-500/30 bg-white/5 hover:bg-white/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 bg-white/10 rounded-lg mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{formatCurrency(plan.price)}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => changePlan(plan.id)}
                  disabled={changingPlan || isCurrent}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isCurrent
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {changingPlan ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Processing...</span>
                    </div>
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No billing history available</p>
            </div>
          ) : (
            billingHistory.map((item) => {
              const StatusIcon = getStatusIcon(item.status)
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(item.status).replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.description}</p>
                      <p className="text-sm text-gray-400">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(item.amount)}</p>
                    <p className={`text-sm capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}