import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
      <nav className="fixed top-0 w-full z-50 bg-[#0A0C10]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">OrPaynter™</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it works</a>
              <a href="#outcomes" className="hover:text-blue-400 transition-colors">Outcomes</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Early Access</a>
              <button 
                onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-black px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-white mb-6 uppercase">
              The Orchestrator <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                of Orchestrators
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              The meta-intelligence layer that aligns your agents, your tools, and your team. 
              Correlating 508+ sources in 91ms to ensure your next move is the right move.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                Request early access <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/10 transition-all">
                Watch 2-minute demo
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
                  <LayoutDashboard className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-sm font-mono text-blue-300">INTELLIGENCE GRAPH LOADED</p>
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
                description: "Connect your 508+ sources—Notion, Slack, GitHub, CRM, and legal docs. OrPaynter builds the Intelligence Graph in real-time."
              },
              {
                icon: Target,
                step: "02",
                title: "Align the Orchestrators",
                description: "Define your high-level objectives. OrPaynter coordinates your existing AI agents and tools to ensure zero drift from the goal."
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
                benefits: ["Automated innovation trails", "91ms audit-ready discovery", "Risk mitigation by design"]
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

      {/* Social Proof */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-8">Works with your stack</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
              {/* Using text labels as placeholders for logos */}
              <span className="text-xl font-bold">Supabase</span>
              <span className="text-xl font-bold">Vercel</span>
              <span className="text-xl font-bold">Stripe</span>
              <span className="text-xl font-bold">Slack</span>
              <span className="text-xl font-bold">GitHub</span>
            </div>
          </div>
          <div className="bg-[#0D0F14] p-10 rounded-3xl border border-white/5 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-xs font-bold text-white uppercase">Founder Note</div>
            <p className="text-xl text-slate-300 italic mb-8 leading-relaxed">
              "I built OrPaynter while running three companies and 16+ patents in flight. This is the system I needed to not drop the ball. It's the intelligence overlay I wish I had from day one."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400" />
              <div className="text-left">
                <p className="text-white font-bold">OrPaynter Founder</p>
                <p className="text-slate-500 text-sm">100M+ Attention Minutes Managed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="pricing" className="py-24 bg-[#0D0F14]">
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
