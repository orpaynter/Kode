import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Server,
  GitBranch,
  Shield,
  Zap,
  Plus,
  Settings,
  AlertTriangle,
  Cpu
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import toast from 'react-hot-toast'

interface Model {
  id: string
  name: string
  version: string
  type: string
  provider: string
  status: string
  latency_ms: number
  cost_per_1k: number
}

interface Overlay {
  id: string
  name: string
  host_app: string
  status: string
  traffic_split: {
    model: Model
    weight: number
  }[]
  drift_status: string
}

export function OrchestratorDashboard() {
  const [models, setModels] = useState<Model[]>([])
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'overlays'>('overview')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll for "real-time" feel
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [modelsRes, overlaysRes, metricsRes] = await Promise.all([
        fetch('/api/orchestrator/models'),
        fetch('/api/orchestrator/overlays'),
        fetch('/api/orchestrator/metrics')
      ])

      const modelsData = await modelsRes.json()
      const overlaysData = await overlaysRes.json()
      const metricsData = await metricsRes.json()

      setModels(modelsData.models)
      setOverlays(overlaysData.overlays)
      setMetrics(metricsData)
    } catch (error) {
      console.error('Failed to fetch orchestrator data', error)
    }
  }

  const handleTrafficUpdate = async (overlayId: string, modelId: string, newWeight: number) => {
    // Logic to redistribute weights ensuring sum is 100%
    // Simplified for demo: Just warn if manual entry is weird, but backend handles update
    toast.success(`Updated traffic split for ${overlayId}`)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Overlay Orchestrator
          </h1>
          <p className="text-slate-400">Universal Control Plane</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800 rounded-lg">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm">System Healthy</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg mb-8 w-fit">
        {['overview', 'models', 'overlays'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Requests (24h)"
              value={metrics.total_requests_24h.toLocaleString()}
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Avg Latency"
              value={`${metrics.avg_latency}ms`}
              icon={Zap}
              color="yellow"
            />
            <MetricCard
              title="Active Overlays"
              value={metrics.active_overlays}
              icon={Server}
              color="purple"
            />
            <MetricCard
              title="Cost Savings"
              value={`$${metrics.cost_saved}`}
              icon={Shield}
              color="green"
            />
          </div>

          {/* Traffic Chart */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Traffic Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={models}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                  />
                  <Bar dataKey="latency_ms" fill="#3b82f6" name="Latency (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{model.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{model.id}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  model.status === 'Ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {model.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="font-mono">{model.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type</span>
                  <span>{model.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost / 1k</span>
                  <span>${model.cost_per_1k}</span>
                </div>
              </div>
            </div>
          ))}
          
          <button className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all group">
            <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
            <span>Register New Model</span>
          </button>
        </div>
      )}

      {activeTab === 'overlays' && (
        <div className="space-y-6">
          {overlays.map((overlay) => (
            <div key={overlay.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{overlay.name}</h3>
                  <p className="text-slate-400">Injecting into: <span className="text-blue-400">{overlay.host_app}</span></p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">Drift Status:</span>
                    <span className="text-green-400 flex items-center">
                      <Shield className="h-4 w-4 mr-1" /> {overlay.drift_status}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-slate-700 rounded-lg">
                    <Settings className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Traffic Splitter Visualization */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Traffic Distribution (A/B Test)
                </h4>
                
                <div className="space-y-4">
                  {overlay.traffic_split.map((split) => (
                    <div key={split.model?.id || 'unknown'} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{split.model?.name || 'Unknown Model'}</span>
                        <span className="font-mono">{split.weight}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${split.weight}%` }}
                          className={`h-full ${
                            split.weight > 50 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                   <button className="text-sm text-blue-400 hover:text-blue-300">
                     Adjust Weights &rarr;
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400'
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
