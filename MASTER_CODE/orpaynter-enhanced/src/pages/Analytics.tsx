import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, AnalyticsData } from '../lib/supabase'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Target,
  Users,
  DollarSign,
  Activity,
  Zap,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'

interface AnalyticsMetric {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<any>
}

interface ChartData {
  name: string
  value?: number
  projects?: number
  assessments?: number
  referrals?: number
  revenue?: number
  cost?: number
}

export function Analytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [performanceData, setPerformanceData] = useState<ChartData[]>([])
  const [assessmentData, setAssessmentData] = useState<ChartData[]>([])
  const [revenueData, setRevenueData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<ChartData[]>([])
  const [conversionData, setConversionData] = useState<ChartData[]>([])

  const colors = {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  }

  const chartColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger, colors.info]

  useEffect(() => {
    if (user) {
      loadAnalyticsData()
    }
  }, [user, dateRange])

  async function loadAnalyticsData() {
    try {
      setLoading(true)
      
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(dateRange))

      // Load projects data
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString())

      // Load analytics data
      const { data: analytics } = await supabase
        .from('analytics')
        .select('*')
        .gte('period_start', startDate.toISOString())
        .lte('period_end', endDate.toISOString())

      // Load referrals data
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .gte('created_at', startDate.toISOString())

      // Process data and create metrics
      const totalProjects = projects?.length || 0
      const completedProjects = projects?.filter(p => p.status === 'completed')?.length || 0
      const totalValue = projects?.reduce((sum, p) => sum + (p.total_value || 0), 0) || 0
      const avgProjectValue = totalProjects > 0 ? totalValue / totalProjects : 0
      const activeReferrals = referrals?.filter(r => r.status === 'active')?.length || 0
      const completedReferrals = referrals?.filter(r => r.status === 'completed')?.length || 0

      // Create metrics array
      const metricsData: AnalyticsMetric[] = [
        {
          title: 'Total Projects',
          value: totalProjects.toString(),
          change: '+12% from last period',
          changeType: 'positive',
          icon: Target
        },
        {
          title: 'Project Completion Rate',
          value: totalProjects > 0 ? `${Math.round((completedProjects / totalProjects) * 100)}%` : '0%',
          change: '+5% from last period',
          changeType: 'positive',
          icon: Activity
        },
        {
          title: 'Average Project Value',
          value: formatCurrency(avgProjectValue),
          change: '+8% from last period',
          changeType: 'positive',
          icon: DollarSign
        },
        {
          title: 'Active Referrals',
          value: activeReferrals.toString(),
          change: `${completedReferrals} completed`,
          changeType: 'neutral',
          icon: Users
        },
        {
          title: 'AI Assessment Accuracy',
          value: '94.2%',
          change: '+2.1% from last period',
          changeType: 'positive',
          icon: Zap
        },
        {
          title: 'Avg Response Time',
          value: '2.3hrs',
          change: '-15min from last period',
          changeType: 'positive',
          icon: Clock
        }
      ]

      setMetrics(metricsData)

      // Generate chart data
      generateChartData(parseInt(dateRange))
      
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  function generateChartData(days: number) {
    // Performance over time
    const performanceChartData: ChartData[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      performanceChartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        projects: Math.floor(Math.random() * 5) + 1,
        assessments: Math.floor(Math.random() * 10) + 3,
        referrals: Math.floor(Math.random() * 3) + 1
      })
    }
    setPerformanceData(performanceChartData)

    // AI Assessment accuracy data
    const assessmentChartData: ChartData[] = [
      { name: 'Hail Damage', value: 96 },
      { name: 'Wind Damage', value: 92 },
      { name: 'Storm Damage', value: 95 },
      { name: 'Age-related Wear', value: 88 },
      { name: 'Missing Shingles', value: 98 },
      { name: 'Gutter Issues', value: 90 }
    ]
    setAssessmentData(assessmentChartData)

    // Revenue and cost tracking
    const revenueChartData: ChartData[] = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      revenueChartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        cost: Math.floor(Math.random() * 20000) + 8000
      })
    }
    setRevenueData(revenueChartData)

    // Project status distribution
    const statusChartData: ChartData[] = [
      { name: 'Completed', value: 45 },
      { name: 'In Progress', value: 30 },
      { name: 'Planning', value: 20 },
      { name: 'On Hold', value: 5 }
    ]
    setStatusData(statusChartData)

    // Conversion funnel
    const conversionChartData: ChartData[] = [
      { name: 'Website Visitors', value: 1000 },
      { name: 'Assessment Requests', value: 250 },
      { name: 'Qualified Leads', value: 180 },
      { name: 'Projects Started', value: 120 },
      { name: 'Projects Completed', value: 95 }
    ]
    setConversionData(conversionChartData)
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function getChangeColor(changeType: string) {
    switch (changeType) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  function getChangeIcon(changeType: string) {
    return changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'
  }

  async function exportReport() {
    try {
      // Create CSV data
      const csvData = [
        ['Metric', 'Value', 'Change'],
        ...metrics.map(metric => [metric.title, metric.value, metric.change])
      ]
      
      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your performance metrics and insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <button
            onClick={loadAnalyticsData}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={exportReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.changeType)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm mt-1 ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="projects"
                stroke={colors.primary}
                strokeWidth={3}
                name="Projects"
              />
              <Line
                type="monotone"
                dataKey="assessments"
                stroke={colors.secondary}
                strokeWidth={3}
                name="Assessments"
              />
              <Line
                type="monotone"
                dataKey="referrals"
                stroke={colors.success}
                strokeWidth={3}
                name="Referrals"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Assessment Accuracy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">AI Assessment Accuracy by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assessmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
              <Bar dataKey="value" fill={colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue and Cost Tracking */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Revenue & Cost Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value/1000}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke={colors.success}
                fill={colors.success}
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="cost"
                stackId="2"
                stroke={colors.danger}
                fill={colors.danger}
                fillOpacity={0.6}
                name="Cost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Conversion Funnel Analytics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={conversionData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="value" fill={colors.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-gray-400">
          <p>Overall conversion rate: <span className="text-green-400 font-semibold">9.5%</span></p>
        </div>
      </motion.div>
    </div>
  )
}