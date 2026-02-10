import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  FileText,
  DollarSign,
  BarChart,
  Lock,
  Server
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        const data = await response.json();
        toast.success(`Application received! You are #${data.waitlist_position} on the waitlist.`);
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
              <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
              <a href="#impact" className="hover:text-white transition-colors">Impact</a>
              {user ? (
                <Link 
                  to="/command-center"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  Command Center
                </Link>
              ) : (
                <button 
                  onClick={() => navigate('/assessment')}
                  className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                  Try Live Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section: WHAT I HAVE */}
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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">System Live: v2.4.0 Stable</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              The First Autonomous <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Roofing Intelligence Platform
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Eliminate the 14-day claims cycle. Instantly analyze damage, estimate costs, and generate insurance-ready reports with <span className="text-white">0.05ms latency</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/assessment')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-2xl shadow-blue-600/40 hover:-translate-y-1"
              >
                Start Free Analysis <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg border border-white/10 transition-all backdrop-blur-sm"
              >
                Join Enterprise Waitlist
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section: WHAT IT DOES */}
      <section id="capabilities" className="py-24 border-t border-white/5 bg-[#0D0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Capabilities</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter">Autonomous Operations</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI Damage Detection",
                desc: "Proprietary computer vision models identify hail hits, wind uplift, and granule loss with 98.4% accuracy.",
                metric: "0.05ms Analysis"
              },
              {
                icon: DollarSign,
                title: "Instant Cost Estimation",
                desc: "Real-time calculation of labor and materials based on local zip code rates and waste factors.",
                metric: "+/- 2% Variance"
              },
              {
                icon: FileText,
                title: "Compliance Reporting",
                desc: "Auto-generates Xactimate-compatible PDF reports that meet all insurance carrier standards.",
                metric: "100% Audit Ready"
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#0A0C10] border border-white/10 p-8 rounded-2xl hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded-full text-slate-400">{item.metric}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">The Workflow</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter">From Chaos to Clarity</h3>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Ingest", desc: "Upload drone imagery or smartphone photos directly to the secure cloud." },
                { step: "02", title: "Analyze", desc: "AI Engine scans for 12+ damage types and correlates with weather history." },
                { step: "03", title: "Validate", desc: "System cross-references findings with local building codes and manufacturer specs." },
                { step: "04", title: "Execute", desc: "Download the final report and dispatch matched contractors immediately." }
              ].map((item, i) => (
                <div key={i} className="bg-[#0D0F14] border border-white/10 p-6 rounded-2xl relative z-10">
                  <span className="text-4xl font-black text-blue-500/20 absolute top-4 right-4">{item.step}</span>
                  <h4 className="text-lg font-bold text-white mb-2 uppercase">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section: WHY IT'S NEEDED */}
      <section id="impact" className="py-24 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Market Impact</h2>
              <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6">Stop Leaving Money <br/>on the Table.</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                The traditional claims process is broken. It takes too long, costs too much, and relies on subjective human judgment. OrPaynter brings objective, data-driven truth to the equation.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: "Reduction in Claim Disputes", value: "80%" },
                  { label: "Increase in Contractor Close Rate", value: "40%" },
                  { label: "Time Saved Per Claim", value: "14 Days" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="text-3xl font-black text-white w-24 text-right">{stat.value}</div>
                    <div className="h-px bg-white/10 flex-1" />
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-8 aspect-square flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative z-10">
                <div className="bg-[#0D0F14] p-6 rounded-xl border border-white/10 mb-4 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 uppercase">Claim #8829-X</span>
                    <span className="text-xs text-green-400 font-bold">APPROVED</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <div className="bg-[#0D0F14] p-6 rounded-xl border border-white/10 ml-8 shadow-xl opacity-80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 uppercase">Claim #8830-Y</span>
                    <span className="text-xs text-blue-400 font-bold">PROCESSING</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs: 10x Details */}
      <section className="py-24 border-y border-white/5 bg-[#0D0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">System Specifications</h2>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Enterprise-Grade Infrastructure</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Security", value: "SOC2 Type II", icon: Lock },
              { label: "Encryption", value: "AES-256 GCM", icon: Shield },
              { label: "Uptime SLA", value: "99.99%", icon: Server },
              { label: "API Latency", value: "< 100ms", icon: Zap }
            ].map((spec, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <spec.icon className="h-8 w-8 text-blue-500 mb-4" />
                <div className="text-lg font-black text-white mb-1">{spec.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access-form" className="py-24 bg-[#0A0C10]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Secure Your Competitive Advantage</h2>
            <p className="text-slate-400">Join the elite network of contractors and adjusters using OrPaynter.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0D0F14] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white" 
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white" 
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                >
                  <option value="">Select role...</option>
                  <option value="contractor">Roofing Contractor</option>
                  <option value="adjuster">Insurance Adjuster</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Company Size</label>
                <select 
                  value={formData.companyStage}
                  onChange={(e) => setFormData({...formData, companyStage: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                >
                  <option value="">Select size...</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="50+">50+ Employees</option>
                </select>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Processing...' : 'Apply for Access'}
            </button>
          </form>
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
