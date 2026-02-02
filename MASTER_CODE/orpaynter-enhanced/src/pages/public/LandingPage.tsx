import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Zap, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  Cpu, 
  Workflow, 
  LayoutDashboard,
  MessageSquare,
  Lock,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    companyStage: '',
    tools: '',
    chaosPoint: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Application submitted! Check your email.');
        setFormData({
          name: '',
          email: '',
          role: '',
          companyStage: '',
          tools: '',
          chaosPoint: ''
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0C10]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">OrPaynter</span>
                <span className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase mt-1">Intelligence</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-widest text-slate-400">
              <a href="#how-it-works" className="hover:text-white transition-colors">Architecture</a>
              <a href="#outcomes" className="hover:text-white transition-colors">Outcomes</a>
              <a href="#validation" className="hover:text-white transition-colors">Validation</a>
              {user ? (
                <Link 
                  to="/command-center"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  Command Center
                </Link>
              ) : (
                <button 
                  onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                  Join the Elite
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-600/20 blur-[160px] rounded-full -z-10 animate-pulse" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">System Live: 0.05ms Latency</span>
            </div>
            
            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              The Orchestrator <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                of Orchestrators
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              The meta-intelligence layer that aligns your agents, your tools, and your team. 
              Built for founders who demand <span className="text-white">absolute clarity</span> in high-complexity environments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-2xl shadow-blue-600/40 hover:-translate-y-1"
              >
                Request Early Access <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg border border-white/10 transition-all backdrop-blur-sm">
                Watch the Briefing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem + Value Prop */}
      <section className="py-24 border-t border-white/5 bg-[#0D0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Your tools have agents. <br />
                <span className="text-blue-500">OrPaynter has the objective.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">The Fragmented Stack</h3>
                    <p className="text-slate-400">Your AI agents are siloed. Your CRM agent doesn't talk to your dev agent. Context is lost in the gaps, creating "Strategic Debt."</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">The Orchestrator Solution</h3>
                    <p className="text-slate-400">OrPaynter sits above the fray. It synchronizes every signal, every agent, and every doc into a single, unified intelligence graph.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative text-center">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-2xl">
                  <img src="/logo.png" alt="Command Processor" className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-sm font-mono text-blue-300 text-center">COMMAND PROCESSOR ONLINE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-widest">How Meta-Orchestration Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three steps to achieving organizational omniscience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                step: "01",
                title: "Ingest the Context",
                description: "Connect your global data sources. OrPaynter builds the Intelligence Graph at 0.05ms speed, 1,800x faster than industry standards."
              },
              {
                icon: Target,
                step: "02",
                title: "Align the Orchestrators",
                description: "Define objectives. Our blockchain-verified engine coordinates agents with 82.5% market detection accuracy and zero false positives."
              },
              {
                icon: Workflow,
                step: "03",
                title: "Command the Outcome",
                description: "Get the 'Next Best Move' surfaced automatically. OrPaynter front-runs bottlenecks before they hit your desk."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#0D0F14] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all group">
                <span className="text-sm font-mono text-blue-500 mb-4 block">{item.step}</span>
                <item.icon className="h-10 w-10 text-white mb-6 group-hover:text-blue-400 transition-colors" />
                <h3 className="text-xl font-bold text-white mb-4 uppercase">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section id="outcomes" className="py-24 bg-blue-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tighter">Command Your Growth</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Founders",
                tagline: "The Strategic Nervous System.",
                benefits: ["Front-run fundraising bottlenecks", "Automated investor updates", "Real-time decision intelligence"]
              },
              {
                title: "For Operators",
                tagline: "The Single Pane of Command.",
                benefits: ["Agent-to-agent synchronization", "Cross-tool context preservation", "Resource allocation alerts"]
              },
              {
                title: "For Legal / IP",
                tagline: "Innovation, Documented.",
                benefits: ["Automated innovation trails", "0.05ms audit-ready discovery", "Risk mitigation by blockchain design"]
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#0A0C10] border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{item.title}</h3>
                <p className="text-blue-400 text-sm mb-6 font-mono">{item.tagline}</p>
                <ul className="space-y-4">
                  {item.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Truth Machine - Conclusive Validation */}
      <section id="validation" className="py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0D0F14] p-12 rounded-3xl border border-white/10 shadow-2xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl">Audit-Ready Intelligence</div>
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Signal Correlation</span>
                      <p className="text-sm text-slate-400 font-medium">Validated against 508 live data sources</p>
                    </div>
                    <span className="text-4xl font-black text-blue-400 tracking-tighter">0.05ms</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Detection Precision</span>
                      <p className="text-sm text-slate-400 font-medium">HFT-grade anomaly detection</p>
                    </div>
                    <span className="text-4xl font-black text-green-400 tracking-tighter">82.5%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">False Positive Drift</span>
                      <p className="text-sm text-slate-400 font-medium">Zero-latency objective alignment</p>
                    </div>
                    <span className="text-4xl font-black text-white tracking-tighter">0.00%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Confidence (P-Value)</span>
                      <p className="text-sm text-slate-400 font-medium">Blockchain-backed ground truth</p>
                    </div>
                    <span className="text-4xl font-black text-cyan-400 tracking-tighter">p&lt;0.001</span>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Shield className="h-8 w-8 text-blue-500" />
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Extracted from the <span className="text-white">MCP Intelligence Ecosystem: Conclusive Validation Report (2026)</span>. Benchmarked against 1,100+ validated data points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-10 text-left">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.9] uppercase">
                  The Conclusive <br />
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent italic">Truth Machine.</span>
                </h2>
                <p className="text-slate-400 text-xl leading-relaxed font-medium">
                  OrPaynter is the world's first <span className="text-white">Conclusive Intelligence Layer</span>. We correlate every signal, every document, and every agent action against a blockchain-verified objective. 
                </p>
                <p className="text-slate-500 text-lg leading-relaxed">
                  While others provide "chatbots," we provide the <span className="text-blue-400">Strategic Nervous System</span> that ensures your organization moves as one.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="text-white font-bold uppercase text-xs tracking-widest">Immutable Logs</h4>
                  <p className="text-sm text-slate-500">Every decision and correlation is logged to an immutable ledger for audit-readiness.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-bold uppercase text-xs tracking-widest">Cross-Domain Memory</h4>
                  <p className="text-sm text-slate-500">Context is preserved across Slack, GitHub, HubSpot, and Twilio automatically.</p>
                </div>
              </div>

              <div className="flex pt-4">
                <button className="group text-blue-400 font-black uppercase text-sm tracking-[0.2em] flex items-center gap-3 hover:text-white transition-all">
                  Access the Full Validation Data 
                  <div className="bg-blue-500/10 p-2 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Preview - The actual program */}
      <section className="py-24 bg-gradient-to-b from-[#0A0C10] to-[#0D0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">The Interface</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">Command Control</h3>
          </div>

          <div className="relative group mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0A0C10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-[16/10]">
              {/* Mock Dashboard UI */}
              <div className="absolute inset-0 p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">System Status: Nominal</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-24 rounded bg-white/5 border border-white/10" />
                    <div className="h-8 w-8 rounded bg-blue-600/20 border border-blue-500/50" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 flex-1">
                  <div className="col-span-2 space-y-6">
                    <div className="h-1/2 rounded-xl bg-white/5 border border-white/5 p-6">
                      <div className="flex justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Intelligence Graph</span>
                        <div className="flex gap-2">
                          <div className="h-1 w-8 rounded-full bg-blue-500" />
                          <div className="h-1 w-8 rounded-full bg-white/10" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <Workflow className="h-16 w-16 text-blue-500/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 h-1/2">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Active Agents</span>
                        <span className="text-2xl font-black text-white">12</span>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Signals Processed</span>
                        <span className="text-2xl font-black text-white">1.1M</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-blue-600/5 border border-blue-500/20 p-6 flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Recent Actions</span>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-12 w-full rounded-lg bg-white/5 border border-white/5" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Overlay for "Visualizing the Program" */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center space-y-6 px-12">
                  <h4 className="text-2xl font-bold text-white uppercase">Experience the Meta-Intelligence</h4>
                  <p className="text-slate-300">Our command center is currently in private beta for elite cohorts. <br/>Join the waitlist to secure your seat.</p>
                  <button 
                    onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-blue-500 transition-all"
                  >
                    Request Demo Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Moat / Investor Narrative */}
      <section className="py-24 bg-gradient-to-b from-[#0D0F14] to-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 text-center">The Moat</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">Engineered for Dominance.</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "508 Sources",
                desc: "Real-time ingestion across financial, social, and operational data silos.",
                stat: "High-Fidelity"
              },
              {
                title: "91ms Correlation",
                desc: "Full-stack prediction cycle that front-runs market movements.",
                stat: "Sub-Second"
              },
              {
                title: "82.5% Accuracy",
                desc: "Validated detection of market manipulation and arbitrage windows.",
                stat: "Institutional"
              },
              {
                title: "SOC 2 Ready",
                desc: "Enterprise-grade security architecture with immutable audit logs.",
                stat: "Sovereign"
              }
            ].map((item, i) => (
              <div key={i} className="relative group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/50 transition-all">
                <div className="text-blue-500 font-black text-xs uppercase tracking-widest mb-4">{item.stat}</div>
                <h4 className="text-2xl font-black text-white mb-4 uppercase">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Arms - The Tactical Nervous System */}
      <section className="py-24 border-t border-white/5 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    name: "Communication (Twilio)",
                    status: "Deeply Integrated",
                    desc: "Autonomous voice and SMS channels for real-time outreach and verification.",
                    icon: MessageSquare
                  },
                  {
                    name: "Intelligence (AI/ASI)",
                    status: "Proprietary Models",
                    desc: "Leveraging Anthropic, OpenAI, and custom RoofNet models for high-fidelity analysis.",
                    icon: Cpu
                  },
                  {
                    name: "Distribution (Resend/Sendgrid)",
                    status: "Optimized Throughput",
                    desc: "Bulletproof email delivery for critical alerts and investor briefings.",
                    icon: ArrowRight
                  },
                  {
                    name: "Memory (CRM/Operational)",
                    status: "Context Preservation",
                    desc: "Unified operational memory across every interaction and data point.",
                    icon: LayoutDashboard
                  }
                ].map((arm, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all group">
                    <arm.icon className="h-8 w-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white font-bold text-sm uppercase mb-1">{arm.name}</h4>
                    <p className="text-[10px] font-mono text-blue-400 mb-3">{arm.status}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{arm.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Tactical Execution</h2>
              <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">Execution Arms. <br/><span className="text-slate-500">Not Just Insights.</span></h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Most platforms stop at "telling you what to do." OrPaynter possesses the <span className="text-white">Execution Arms</span> to actually do it. 
                Our deep integration with Twilio, Sendgrid, and our proprietary AI stack means the Orchestrator doesn't just predict—it acts.
              </p>
              <div className="pt-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-blue-300">
                    Verified 91ms latency across all tactical execution nodes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture / The Program */}
      <section id="architecture" className="py-24 bg-[#0D0F14] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">The Program</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">The Orchestration Stack</h3>
          </div>

          <div className="relative">
            {/* Connection Lines (Conceptual) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-3 gap-12 relative">
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative">
                  <div className="absolute -top-4 left-6 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Input Layer</div>
                  <h4 className="text-xl font-bold text-white mb-4 uppercase">Data Ingestion</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> 508+ Live Data Sources</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Real-time Context Extraction</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Multi-Domain Correlation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl backdrop-blur-xl relative scale-110 shadow-2xl shadow-blue-500/10">
                  <div className="absolute -top-4 left-6 bg-cyan-500 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Meta-Layer</div>
                  <h4 className="text-xl font-bold text-white mb-4 uppercase">The Orchestrator</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-cyan-400" /> 0.05ms Graph Correlation</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-cyan-400" /> Objective-Driven Alignment</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-cyan-400" /> Blockchain Signal Verification</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative">
                  <div className="absolute -top-4 left-6 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Action Layer</div>
                  <h4 className="text-xl font-bold text-white mb-4 uppercase">Tactical Arms</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Twilio Voice/SMS Automation</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> ASI Model Execution</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> CRM/Operational Sync</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access-form" className="py-24 bg-[#0D0F14]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Apply for early access</h2>
            <p className="text-slate-400">We’re onboarding a small group of founders and operators who are managing high-complexity environments.</p>
          </div>
          
          <form id="early-access-form" onSubmit={handleSubmit} className="space-y-6 bg-[#0A0C10] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Work Email</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                  placeholder="john@company.com"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Your Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="">Select role...</option>
                  <option value="founder">Founder / CEO</option>
                  <option value="operator">Operator / COO</option>
                  <option value="cos">Chief of Staff</option>
                  <option value="investor">Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Company Stage</label>
                <select 
                  value={formData.companyStage}
                  onChange={(e) => setFormData({...formData, companyStage: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="">Select stage...</option>
                  <option value="stealth">Stealth / Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="seriesA">Series A+</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Current stack (CRM, Docs, etc.)</label>
              <input 
                type="text" 
                value={formData.tools}
                onChange={(e) => setFormData({...formData, tools: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                placeholder="Notion, Slack, GitHub, HubSpot..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Biggest organizational chaos point?</label>
              <textarea 
                value={formData.chaosPoint}
                onChange={(e) => setFormData({...formData, chaosPoint: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-24" 
                placeholder="e.g. Losing context between fundraising and product building..."
              />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Apply for Early Access'}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is OrPaynter a replacement for my CRM or project management tool?",
                a: "No. OrPaynter is an intelligence overlay. It connects to your existing tools (Notion, HubSpot, Slack, etc.) to provide cross-platform context and actionable insights without requiring you to switch tools."
              },
              {
                q: "What data sources can you connect to today?",
                a: "We currently support major productivity suites (Google Workspace, Microsoft 365), communication platforms (Slack, Discord), and developer tools (GitHub, Linear). We are rapidly adding more integrations."
              },
              {
                q: "How is my IP and data protected?",
                a: "We use enterprise-grade encryption and siloed data architectures. Your data is yours. We never train our core models on your proprietary company data."
              },
              {
                q: "Can OrPaynter help with litigation prep or IP disputes?",
                a: "Yes. One of our core modules is designed to create structured, timestamped evidence of innovation and decision history, which can significantly reduce legal discovery time and costs."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-[#0D0F14] p-6 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {faq.q}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Turn your entire company’s chaos <br />
            into a single stream of intelligence.
          </h2>
          <button 
            onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black hover:bg-blue-600 hover:text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl shadow-white/5"
          >
            Request early access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1 rounded-md">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">OrPaynter™</span>
          </div>
          <div className="text-slate-500 text-xs">
            © 2026 OrPaynter Intelligence. All rights reserved.
          </div>
          <div className="flex gap-6 text-slate-400 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:hello@orpaynter.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
