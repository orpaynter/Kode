import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ShieldCheck, Server, AlertTriangle, FileArchive, CheckCircle, CreditCard, Lock } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import toast from 'react-hot-toast'

export default function DownloadPage() {
  const [purchaseStep, setPurchaseStep] = useState<'info' | 'payment' | 'success'>('info')
  const [email, setEmail] = useState('')
  const [licenseKey, setLicenseKey] = useState('')
  const [secureDownloadUrl, setSecureDownloadUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const releaseInfo = {
    version: 'v1.0.0',
    date: '2026-02-09',
    size: '14.2 MB',
    checksum: '94cf482b9049e03e926f05abb6f065ac20cc4091b941ebbcbef3378909291d4d',
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const res = await fetch('http://localhost:5000/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: 'enterprise', payment_method: 'credit_card' })
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setLicenseKey(data.license_key)
        setSecureDownloadUrl(data.download_url)
        setPurchaseStep('success')
        toast.success('Payment successful! License generated.')
      } else {
        toast.error(data.error || 'Payment failed')
      }
    } catch (err) {
      toast.error('Connection error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (secureDownloadUrl) {
       window.location.href = `http://localhost:5000${secureDownloadUrl}`
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/20"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Official Release {releaseInfo.version}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
          >
            Get OrPaynter Enterprise
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            The comprehensive AI orchestration platform for the modern roofing industry.
            Deploy intelligent overlays in minutes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Purchase/Download Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden"
          >
            {/* Purchase Flow Steps */}
            {purchaseStep === 'info' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Enterprise License</h2>
                  <span className="text-3xl font-bold text-blue-400">$499<span className="text-sm text-slate-400 font-normal">/yr</span></span>
                </div>
                <ul className="space-y-3 text-slate-300">
                   <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Unlimited AI Overlays</li>
                   <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Advanced Traffic Splitting</li>
                   <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Self-Hosted & Cloud Support</li>
                </ul>
                <button 
                  onClick={() => setPurchaseStep('payment')}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            )}

            {purchaseStep === 'payment' && (
              <form onSubmit={handlePurchase} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Secure Checkout</h2>
                  <Lock className="h-4 w-4 text-green-400" />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Card Number (Simulated)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                    <input 
                      type="text" 
                      defaultValue="4242 4242 4242 4242"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="MM/YY" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none" defaultValue="12/28" />
                   <input type="text" placeholder="CVC" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none" defaultValue="123" />
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? <span>Processing...</span> : <span>Pay $499.00</span>}
                </button>
                <button 
                  type="button"
                  onClick={() => setPurchaseStep('info')}
                  className="w-full text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            )}

            {purchaseStep === 'success' && (
              <div className="space-y-6 text-center">
                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle className="h-8 w-8 text-green-400" />
                 </div>
                 <h2 className="text-2xl font-bold">Purchase Successful!</h2>
                 
                 <div className="bg-black/30 p-4 rounded-lg text-left">
                   <p className="text-xs text-slate-400 mb-1">LICENSE KEY:</p>
                   <code className="text-green-400 font-mono text-sm break-all">{licenseKey}</code>
                 </div>

                 <button 
                   onClick={handleDownload}
                   className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/25 animate-pulse"
                 >
                   <Download className="h-5 w-5" />
                   <span>Download Package ({releaseInfo.size})</span>
                 </button>
              </div>
            )}
            
            <p className="mt-4 text-xs text-center text-slate-500">
              {purchaseStep === 'payment' ? 'Payments are processed securely via MockStripe.' : 'By downloading, you agree to our Terms of Service.'}
            </p>
          </motion.div>

          {/* Verification & Security */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Changelog */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileArchive className="h-5 w-5 text-blue-400 mr-2" />
                Release Notes
              </h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p><span className="text-white font-medium">New Features:</span></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>AI Orchestrator Dashboard with Visual Traffic Splitter</li>
                  <li>Real-time roof damage assessment simulation</li>
                  <li>Integrated offline-first PowerSync database</li>
                </ul>
                <p className="mt-2"><span className="text-white font-medium">Improvements:</span></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Enhanced dark mode UI for admin panels</li>
                  <li>Optimized build size and load performance</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ShieldCheck className="h-5 w-5 text-green-400 mr-2" />
                Verify Integrity (SHA-256)
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Verify the authenticity of your download by checking its file hash against the official checksum below.
              </p>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-slate-300 break-all select-all border border-slate-700/50">
                {releaseInfo.checksum}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Server className="h-5 w-5 text-purple-400 mr-2" />
                Installation Requirements
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-2 mr-2" />
                  Node.js v18.0.0 or higher
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-2 mr-2" />
                  Docker Desktop (for containerized deployment)
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-2 mr-2" />
                  8GB RAM minimum (16GB recommended for AI models)
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
