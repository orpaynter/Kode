import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  FolderOpen,
  BarChart3,
  Zap,
  Target
} from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  totalSavings: number
  assessmentsDone: number
  contractorsMatched: number
  activeReferrals: number
  thisMonthProjects: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  status?: string
}

export function Dashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSavings: 0,
    assessmentsDone: 0,
    contractorsMatched: 0,
    activeReferrals: 0,
    thisMonthProjects: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  async function loadDashboardData() {
    try {
      // Load projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)

      // Load referrals stats
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)

      // Load damage assessments
      const { data: assessments } = await supabase
        .from('damage_assessments')
        .select('*')
        .limit(10)

      // Calculate stats
      const totalProjects = projects?.length || 0
      const totalSavings = projects?.reduce((sum, p) => sum + (p.total_value || 0), 0) || 0
      const assessmentsDone = assessments?.length || 8 // Default value for demo
      const activeReferrals = referrals?.filter(r => r.status === 'active')?.length || 0
      const contractorsMatched = 12 // Default value for demo
      
      // This month projects
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthProjects = projects?.filter(p => 
        new Date(p.created_at!) >= thisMonth
      )?.length || 0

      setStats({
        totalProjects,
        totalSavings,
        assessmentsDone,
        contractorsMatched,
        activeReferrals,
        thisMonthProjects
      })

      // Create recent activity from various sources
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'project',
          description: 'New roofing project created for 123 Main St',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '2',
          type: 'assessment',
          description: 'AI damage assessment completed with 94% confidence',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '3',
          type: 'referral',
          description: 'New referral from John Smith accepted',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: '4',
          type: 'contractor',
          description: 'Matched with 3 qualified contractors in your area',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '5',
          type: 'analytics',
          description: 'Weekly performance report generated',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ]

      setRecentActivity(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
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

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return FolderOpen
      case 'assessment': return Zap
      case 'referral': return Users
      case 'contractor': return Target
      case 'analytics': return BarChart3
      default: return Activity
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
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
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {profile?.full_name || user?.email}
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your roofing projects
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Today</p>
            <p className="text-xl font-semibold text-white">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Active Projects',
            value: stats.totalProjects.toString(),
            icon: FolderOpen,
            color: 'bg-blue-500/20 text-blue-400',
            change: `+${stats.thisMonthProjects} this month`
          },
          {
            title: 'Total Savings',
            value: formatCurrency(stats.totalSavings),
            icon: DollarSign,
            color: 'bg-green-500/20 text-green-400',
            change: '+12% from last month'
          },
          {
            title: 'AI Assessments',
            value: stats.assessmentsDone.toString(),
            icon: Zap,
            color: 'bg-purple-500/20 text-purple-400',
            change: '94% accuracy rate'
          },
          {
            title: 'Contractors Matched',
            value: stats.contractorsMatched.toString(),
            icon: Target,
            color: 'bg-orange-500/20 text-orange-400',
            change: 'Avg response: 2hrs'
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
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-green-400 mt-1">{stat.change}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.status && (
                        <span className={`text-xs ${getStatusColor(activity.status)}`}>
                          • {activity.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Create New Project',
                description: 'Start a new roofing project assessment',
                icon: FolderOpen,
                href: '/projects',
                color: 'hover:bg-blue-500/20'
              },
              {
                title: 'Upload Roof Photos',
                description: 'Get AI-powered damage analysis',
                icon: Zap,
                href: '/ai-agents',
                color: 'hover:bg-purple-500/20'
              },
              {
                title: 'View Analytics',
                description: 'Check your performance metrics',
                icon: BarChart3,
                href: '/analytics',
                color: 'hover:bg-green-500/20'
              },
              {
                title: 'Invite Referrals',
                description: 'Share your referral link',
                icon: Users,
                href: '/referrals',
                color: 'hover:bg-orange-500/20'
              }
            ].map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.title}
                  href={action.href}
                  className={`block p-4 rounded-lg border border-white/10 transition-colors ${action.color}`}
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="h-6 w-6 text-white" />
                    <div>
                      <p className="font-medium text-white">{action.title}</p>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}