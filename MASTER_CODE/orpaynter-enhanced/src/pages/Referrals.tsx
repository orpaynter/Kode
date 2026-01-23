import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, ReferralData } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Gift,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Zap,
  Award,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  completedReferrals: number
  totalEarnings: number
  pendingEarnings: number
  conversionRate: number
}

export function Referrals() {
  const { user, profile } = useAuth()
  const [referrals, setReferrals] = useState<ReferralData[]>([])
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [referralLink, setReferralLink] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    emails: '',
    message: ''
  })
  const [sendingInvites, setSendingInvites] = useState(false)

  useEffect(() => {
    if (user) {
      generateReferralLink()
      loadReferralsData()
    }
  }, [user])

  function generateReferralLink() {
    if (user) {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/signup?ref=${user.id}`
      setReferralLink(link)
    }
  }

  async function loadReferralsData() {
    try {
      setLoading(true)
      
      // Load referrals data
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const referrals = referralsData || []
      setReferrals(referrals)

      // Calculate stats
      const totalReferrals = referrals.length
      const activeReferrals = referrals.filter(r => r.status === 'pending').length
      const completedReferrals = referrals.filter(r => r.status === 'completed').length
      const totalEarnings = referrals
        .filter(r => r.commission_paid)
        .reduce((sum, r) => sum + (r.commission_amount || 0), 0)
      const pendingEarnings = referrals
        .filter(r => !r.commission_paid && r.status === 'completed')
        .reduce((sum, r) => sum + (r.commission_amount || 0), 0)
      const conversionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0

      setStats({
        totalReferrals,
        activeReferrals,
        completedReferrals,
        totalEarnings,
        pendingEarnings,
        conversionRate
      })

      // If no referrals exist, create some sample data for demo
      if (referrals.length === 0) {
        createSampleReferrals()
      }
    } catch (error) {
      console.error('Error loading referrals data:', error)
      toast.error('Failed to load referrals data')
    } finally {
      setLoading(false)
    }
  }

  async function createSampleReferrals() {
    const sampleReferrals = [
      {
        referrer_id: user!.id,
        referee_email: 'john.smith@example.com',
        referee_name: 'John Smith',
        status: 'completed',
        commission_amount: 250,
        commission_paid: true,
        completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        referrer_id: user!.id,
        referee_email: 'sarah.johnson@example.com',
        referee_name: 'Sarah Johnson',
        status: 'completed',
        commission_amount: 150,
        commission_paid: false,
        completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        referrer_id: user!.id,
        referee_email: 'mike.wilson@example.com',
        referee_name: 'Mike Wilson',
        status: 'pending',
        commission_amount: null,
        commission_paid: false,
        completed_at: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert(sampleReferrals)
        .select()

      if (!error && data) {
        setReferrals(data)
        // Recalculate stats with sample data
        const totalEarnings = data.filter(r => r.commission_paid).reduce((sum, r) => sum + (r.commission_amount || 0), 0)
        const pendingEarnings = data.filter(r => !r.commission_paid && r.status === 'completed').reduce((sum, r) => sum + (r.commission_amount || 0), 0)
        setStats({
          totalReferrals: data.length,
          activeReferrals: data.filter(r => r.status === 'pending').length,
          completedReferrals: data.filter(r => r.status === 'completed').length,
          totalEarnings,
          pendingEarnings,
          conversionRate: (data.filter(r => r.status === 'completed').length / data.length) * 100
        })
      }
    } catch (error) {
      console.error('Error creating sample referrals:', error)
    }
  }

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success('Referral link copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Failed to copy link')
    }
  }

  async function sendInvites() {
    if (!inviteForm.emails.trim()) {
      toast.error('Please enter at least one email address')
      return
    }

    setSendingInvites(true)
    try {
      const emails = inviteForm.emails
        .split(/[,\n;]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'))

      if (emails.length === 0) {
        toast.error('Please enter valid email addresses')
        return
      }

      // Create referral records for each email
      const newReferrals = emails.map(email => ({
        referrer_id: user!.id,
        referee_email: email,
        referee_name: email.split('@')[0],
        status: 'pending',
        commission_amount: null,
        commission_paid: false,
        completed_at: null,
        created_at: new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from('referrals')
        .insert(newReferrals)
        .select()

      if (error) throw error

      if (data) {
        setReferrals([...data, ...referrals])
        // Update stats
        setStats(prev => ({
          ...prev,
          totalReferrals: prev.totalReferrals + data.length,
          activeReferrals: prev.activeReferrals + data.length
        }))
      }

      setShowInviteModal(false)
      setInviteForm({ emails: '', message: '' })
      toast.success(`Invited ${emails.length} people successfully!`)
    } catch (error) {
      console.error('Error sending invites:', error)
      toast.error('Failed to send invites')
    } finally {
      setSendingInvites(false)
    }
  }

  function shareViaEmail() {
    const subject = 'Join me on OrPaynter - AI-Powered Roofing Platform'
    const body = `Hi there!\n\nI've been using OrPaynter for my roofing projects and it's been amazing. Their AI-powered damage assessment and contractor matching has saved me tons of time and money.\n\nYou should check it out: ${referralLink}\n\nBest regards,\n${profile?.full_name || 'Your friend'}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function shareViaText() {
    const text = `Check out OrPaynter - AI-powered roofing platform that's been saving me time and money! Sign up here: ${referralLink}`
    if (navigator.share) {
      navigator.share({
        title: 'OrPaynter Referral',
        text: text
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Message copied to clipboard!')
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'expired': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed': return CheckCircle
      case 'pending': return Clock
      case 'expired': return AlertCircle
      default: return Clock
    }
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Referral Program</h1>
          <p className="text-gray-400 mt-1">Earn rewards by referring new users</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Send Invites</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Referrals',
            value: stats.totalReferrals.toString(),
            icon: Users,
            color: 'bg-blue-500/20 text-blue-400',
            subtitle: `${stats.activeReferrals} active`
          },
          {
            title: 'Total Earnings',
            value: formatCurrency(stats.totalEarnings),
            icon: DollarSign,
            color: 'bg-green-500/20 text-green-400',
            subtitle: `${formatCurrency(stats.pendingEarnings)} pending`
          },
          {
            title: 'Conversion Rate',
            value: `${stats.conversionRate.toFixed(1)}%`,
            icon: Target,
            color: 'bg-purple-500/20 text-purple-400',
            subtitle: `${stats.completedReferrals} completed`
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.subtitle}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Your Referral Link</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white/5 border border-white/20 rounded-lg p-3">
              <p className="text-white font-mono text-sm truncate">{referralLink}</p>
            </div>
            <button
              onClick={copyReferralLink}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareViaEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={shareViaText}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message</span>
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Bulk Invite</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Referral History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Referral History</h3>
        
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">No referrals yet</h4>
            <p className="text-gray-400 mb-6">Start inviting friends and earn rewards!</p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Send Your First Invite
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => {
              const StatusIcon = getStatusIcon(referral.status)
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(referral.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{referral.referee_name || referral.referee_email}</p>
                      <p className="text-sm text-gray-400">{referral.referee_email}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      {referral.commission_amount && (
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatCurrency(referral.commission_amount)}</p>
                          <p className={`text-xs ${
                            referral.commission_paid ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {referral.commission_paid ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(referral.status)}`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {referral.completed_at ? formatDate(referral.completed_at) : formatDate(referral.created_at!)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Reward Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Reward Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Basic Tier',
              reward: '$50',
              description: 'For each new user signup',
              icon: Gift,
              color: 'bg-blue-500/20 text-blue-400'
            },
            {
              title: 'Premium Tier',
              reward: '$150',
              description: 'For premium plan subscribers',
              icon: Zap,
              color: 'bg-purple-500/20 text-purple-400'
            },
            {
              title: 'Enterprise Tier',
              reward: '$300',
              description: 'For enterprise customers',
              icon: Award,
              color: 'bg-yellow-500/20 text-yellow-400'
            }
          ].map((tier, index) => {
            const Icon = tier.icon
            return (
              <div
                key={tier.title}
                className="text-center p-6 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className={`inline-flex p-3 rounded-lg ${tier.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-white mb-2">{tier.title}</h4>
                <p className="text-2xl font-bold text-white mb-2">{tier.reward}</p>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Send Invitations</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Addresses *
                  </label>
                  <textarea
                    value={inviteForm.emails}
                    onChange={(e) => setInviteForm({ ...inviteForm, emails: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Enter email addresses (one per line or separated by commas)"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate multiple emails with commas or new lines
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Add a personal message to your invitation..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendInvites}
                    disabled={sendingInvites || !inviteForm.emails.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {sendingInvites ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send Invites</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}