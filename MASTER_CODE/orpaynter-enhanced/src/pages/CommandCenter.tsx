import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Target, 
  Cpu, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  Maximize2,
  Lock,
  Search,
  ChevronRight,
  Globe,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${className}`}>
    {children}
  </div>
)

const Metric = ({ label, value, trend, icon: Icon }: any) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">{label}</p>
    <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
  </div>
)

const ExecutionArm = ({ name, status, desc, icon: Icon, active = false }: any) => (
  <div className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
    active ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
  }`}>
    <div className="flex items-center gap-4 mb-3">
      <div className={`p-3 rounded-xl ${active ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-blue-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{name}</h4>
        <p className="text-[10px] font-mono text-blue-400">{status}</p>
      </div>
    </div>
    <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
  </div>
)

// --- Main Page ---

export function CommandCenter() {
  const { user, profile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('intelligence')
  const [isLive, setIsLive] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-slate-200 p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 ${isLive ? '' : 'hidden'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono">System Live: 0.05ms</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Command Session Active</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase">
            Command <span className="text-blue-500">Center</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-md">
            The Orchestrator of Orchestrators. Unified intelligence and tactical execution for the elite operator.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1px]">
            <div className="h-full w-full rounded-2xl bg-slate-900 flex items-center justify-center font-bold text-white text-sm">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intelligence Graph & Metrics */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Intelligence Metrics */}
          <GlassCard className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            <Metric label="Correlation" value="91ms" trend="+12%" icon={Activity} />
            <Metric label="Validated Data" value="1,124" trend="+40%" icon={ShieldCheck} />
            <Metric label="Active Agents" value="24" icon={Cpu} />
            <Metric label="Alignment" value="98.2%" trend="+2.4%" icon={Target} />
          </GlassCard>

          {/* Graph Visualizer Placeholder */}
          <GlassCard className="aspect-[16/9] relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
            
            {/* Header */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Real-time Correlation Graph</span>
              </div>
              <button className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Mock Graph Elements */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full opacity-30">
                {/* SVG Lines */}
                <svg className="w-full h-full">
                  <path d="M 100 200 Q 300 50 500 200" stroke="currentColor" fill="none" className="text-blue-500/40" strokeWidth="1" />
                  <path d="M 200 400 Q 400 300 600 450" stroke="currentColor" fill="none" className="text-cyan-500/40" strokeWidth="1" />
                  <path d="M 50 500 Q 250 450 450 550" stroke="currentColor" fill="none" className="text-purple-500/40" strokeWidth="1" />
                </svg>
              </div>
              
              {/* Nodes */}
              <div className="absolute top-1/4 left-1/4 p-4 glass rounded-2xl border-blue-500/30 animate-pulse">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-4 glass rounded-2xl border-cyan-500/30">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 glass rounded-full border-white/20 bg-blue-500/10 scale-125">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-mono text-slate-400">INPUT: 508 SOURCES</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-mono text-slate-400">SYNC: 100%</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-blue-400 uppercase">Strategic Nervous System Active</span>
            </div>
          </GlassCard>

          {/* Objective Alignment Engine */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center justify-between">
                Current Objective
                <Target className="w-4 h-4 text-blue-400" />
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <p className="text-xs text-blue-400 font-bold uppercase mb-1">Primary Goal</p>
                  <p className="text-sm text-white font-medium italic">"Scale regional roofing operations by 40% with 0% increase in manual oversight."</p>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alignment Score</span>
                  <span className="text-xs font-black text-green-400 font-mono">98.2%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div className="bg-green-400 h-full rounded-full" style={{ width: '98.2%' }}></div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center justify-between">
                Active Execution
                <Zap className="w-4 h-4 text-blue-400" />
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Market Anomaly Detection', status: 'Running', val: '94%' },
                  { label: 'Autonomous Outreach (Twilio)', status: 'Active', val: '24 calls' },
                  { label: 'Briefing Generation', status: 'Standby', val: '12:00 PM' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{item.status} ({item.val})</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Execution Arms & Tactical HUD */}
        <div className="lg:col-span-4 space-y-8">
          
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Execution Arms</h3>
            <div className="space-y-4">
              <ExecutionArm 
                name="Voice & SMS" 
                status="Twilio Integrated" 
                desc="Autonomous verification and lead warming via localized voice nodes."
                icon={MessageSquare}
                active={true}
              />
              <ExecutionArm 
                name="Meta-Intelligence" 
                status="ASI Models Active" 
                desc="Orchestration across Anthropic, OpenAI, and custom RoofNet models."
                icon={Cpu}
              />
              <ExecutionArm 
                name="Communication" 
                status="Resend/Sendgrid" 
                desc="Institutional-grade distribution of validated briefings."
                icon={Share2}
              />
              <ExecutionArm 
                name="Security Guard" 
                status="Blockchain Audit" 
                desc="Immutable logging of all tactical decisions for IP defense."
                icon={ShieldCheck}
              />
            </div>
            
            <button className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              Add Execution Node
              <ChevronRight className="w-4 h-4" />
            </button>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Recent Tactical Actions</h3>
            <div className="space-y-6">
              {[
                { time: '2m ago', action: 'Signal Detected', desc: 'Market anomaly in TX-75201', type: 'intelligence' },
                { time: '15m ago', action: 'Outreach Initiated', desc: '3 verification calls placed via Node 4', type: 'action' },
                { time: '1h ago', action: 'Briefing Sent', desc: 'Investor deck update to 12 stakeholders', type: 'distribution' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-white/5"></div>}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === 'intelligence' ? 'bg-blue-500/20 text-blue-400' :
                    item.type === 'action' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{item.action}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-3xl border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-white uppercase">Sovereign Mode</p>
                <p className="text-[10px] text-blue-400/70">Encrypted Environment</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
