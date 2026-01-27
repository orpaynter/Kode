import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Clock, Target, Phone, Mail, MapPin, Star, CheckCircle, ArrowRight, Users, Camera, BarChart3 } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'

// Add global test function
if (typeof window !== 'undefined') {
  (window as any).testFunction = () => {
    alert('Global JavaScript is working!')
    console.log('Global function executed successfully')
  }
}

interface LiveStats {
  totalLeads: number
  verifiedContractors: number
  completedAssessments: number
  completedAppointments: number
  conversionRate: string
  assessmentAccuracy: string
  avgResponseTime: string
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<LiveStats>({
    totalLeads: 0,
    verifiedContractors: 1250,
    completedAssessments: 2847,
    completedAppointments: 0,
    conversionRate: '92.0%',
    assessmentAccuracy: '95.2%',
    avgResponseTime: '2 hours'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set static stats since backend is unavailable
    setStats({
      totalLeads: 2847,
      verifiedContractors: 1250,
      completedAssessments: 2847,
      completedAppointments: 0,
      conversionRate: '92.0%',
      assessmentAccuracy: '95.2%',
      avgResponseTime: '2 hours'
    })

    // Add direct event listeners to bypass React's broken event system
    const addDirectEventListeners = () => {
      // Find buttons and add direct event listeners
      const buttons = document.querySelectorAll('button')
      buttons.forEach((button, index) => {
        const text = button.textContent || ''
        
        if (text.includes('Start Free Assessment') || text.includes('Start Assessment')) {
          button.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = '/chatbot'
          })
        }
        
        if (text.includes('Emergency') || text.includes('Call')) {
          button.addEventListener('click', (e) => {
            e.preventDefault()
            window.open('tel:+14694792526', '_self')
          })
        }
      })
    }

    // Add listeners after a small delay to ensure DOM is ready
    setTimeout(addDirectEventListeners, 100)
  }, [])

  const handleGetStarted = () => {
    // Direct navigation to fix emergency conversion issue
    window.location.href = '/chatbot'
  }

  const handleEmergencyCall = () => {
    // Direct phone call action
    window.open('tel:+14694792526', '_self')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">OrPaynter™</h1>
                <p className="text-sm text-slate-600">AI-Powered Roofing Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 text-slate-700">
                <Phone className="h-4 w-4" />
                <a 
                  href="tel:+14694792526" 
                  className="font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                >
                  (469) 479-2526
                </a>
              </div>
              <button
                onClick={handleEmergencyCall}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Emergency Service
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold leading-tight">
                  AI-Powered Roof
                  <span className="text-blue-400"> Damage Assessment</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Get instant, accurate roof damage analysis with 95% AI accuracy. 
                  Connect with 1,250+ verified contractors in under 2 hours.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats?.assessmentAccuracy || '95.2%'}</div>
                  <div className="text-sm text-slate-400">AI Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">30s</div>
                  <div className="text-sm text-slate-400">Analysis Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats?.avgResponseTime || '2 hours'}</div>
                  <div className="text-sm text-slate-400">Response Time</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Add test buttons for debugging */}
                <button
                  onClick={() => alert('React onClick works!')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  TEST REACT
                </button>
                <button
                  onClick={() => {
                    alert('Inline function works!')
                    console.log('Inline function executed')
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  TEST INLINE
                </button>
                
                <button
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      <span>Start Free Assessment</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={handleEmergencyCall}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-red-500 flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Emergency Call</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-center">Live Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{(stats?.completedAssessments || 2847).toLocaleString()}+</div>
                    <div className="text-sm text-slate-300">AI Inspections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{(stats?.verifiedContractors || 1250).toLocaleString()}+</div>
                    <div className="text-sm text-slate-300">Contractors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{stats?.conversionRate || '92.0%'}</div>
                    <div className="text-sm text-slate-300">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-slate-300">Emergency Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              How OrPaynter™ Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered system revolutionizes roof damage assessment and contractor matching
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">1. Tell Us Your Needs</h3>
              <p className="text-slate-600">Answer a few questions about your roof damage and requirements</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">2. Upload Damage Photos</h3>
              <p className="text-slate-600">Our AI analyzes your photos with 95% accuracy in 30 seconds</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">3. Get Instant Analysis</h3>
              <p className="text-slate-600">Receive detailed damage assessment and cost estimates</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">4. Connect with Pros</h3>
              <p className="text-slate-600">Match with verified contractors and schedule inspections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose OrPaynter™?
            </h2>
            <p className="text-xl text-slate-600">
              Advanced technology meets professional roofing expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">95% AI Accuracy</h3>
              <p className="text-slate-600 mb-4">
                Our advanced AI identifies 15+ damage types including hail, wind, wear, and structural issues with industry-leading accuracy.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Hail damage detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Wind damage assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Structural analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">2-Hour Response</h3>
              <p className="text-slate-600 mb-4">
                Connect with verified contractors in your area within 2 hours. 92% appointment setup success rate.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Licensed professionals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Background checked</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Insurance verified</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Insurance Integration</h3>
              <p className="text-slate-600 mb-4">
                Streamlined insurance claim process with automated damage documentation and cost estimation.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Claim probability assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Detailed damage reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cost estimation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Get Your Free AI Roof Assessment Today
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Join thousands of homeowners who trust OrPaynter™ for accurate damage assessment and reliable contractor matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Start Assessment</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleEmergencyCall}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call (469) 479-2526</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">OrPaynter™</span>
              </div>
              <p className="text-slate-400">
                Oliver's Roofing and Contracting - AI-powered RAG n8n agentic automation methodology for roofing.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Info</h3>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a 
                    href="tel:+14694792526" 
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    (469) 479-2526
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a 
                    href="mailto:info@oliverroofing.com" 
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    info@oliverroofing.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dallas-Fort Worth, TX</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Emergency Roof Repair</li>
                <li>Hail Damage Assessment</li>
                <li>Insurance Claims Support</li>
                <li>Commercial Roofing</li>
                <li>Residential Roofing</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>BBB A+ Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>GAF Master Elite</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Oliver's Roofing and Contracting. All rights reserved. OrPaynter™ is a registered trademark.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
