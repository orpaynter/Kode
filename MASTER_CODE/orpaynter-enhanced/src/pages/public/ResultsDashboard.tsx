import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, Star, Calendar, Clock, Shield, CheckCircle, AlertTriangle, Award, Zap } from 'lucide-react'
import { supabase, Lead, DamageAssessment, Contractor } from '../../lib/supabase'
import { formatCurrency, formatPhoneNumber } from '../../lib/utils'
import toast from 'react-hot-toast'

interface MatchedContractor extends Contractor {
  matchScore: number
}

const ResultsDashboard: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>()
  const navigate = useNavigate()
  
  const [lead, setLead] = useState<Lead | null>(null)
  const [assessments, setAssessments] = useState<DamageAssessment[]>([])
  const [contractors, setContractors] = useState<MatchedContractor[]>([])
  const [selectedContractor, setSelectedContractor] = useState<MatchedContractor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentType, setAppointmentType] = useState('inspection')
  const [appointmentNotes, setAppointmentNotes] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (leadId) {
      fetchLeadData()
      fetchAssessments()
      fetchMatchedContractors()
    }
  }, [leadId])

  const fetchLeadData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .maybeSingle()

      if (error) throw error
      setLead(data)
    } catch (error) {
      console.error('Failed to fetch lead data:', error)
      toast.error('Failed to load lead information')
    }
  }

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('damage_assessments')
        .select('*')
        .eq('lead_id', leadId)
        .eq('analysis_status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssessments(data || [])
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
      toast.error('Failed to load damage assessments')
    } finally {
      setLoading(false)
    }
  }

  const fetchMatchedContractors = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('match-contractors', {
        body: {
          leadId,
          maxContractors: 5,
          specialtyRequired: lead?.damage_type?.includes('hail') ? 'hail damage' : undefined
        }
      })

      if (error) throw error
      setContractors(data.matchedContractors || [])
    } catch (error) {
      console.error('Failed to fetch contractors:', error)
      toast.error('Failed to load contractors')
    }
  }

  const scheduleAppointment = async () => {
    if (!selectedContractor || !appointmentDate) {
      toast.error('Please select a contractor and appointment date')
      return
    }

    setIsScheduling(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('schedule-appointment', {
        body: {
          leadId,
          contractorId: selectedContractor.id,
          appointmentDate,
          appointmentType,
          notes: appointmentNotes
        }
      })

      if (error) throw error
      
      toast.success('Appointment scheduled successfully!')
      
      // Show success message with details
      const appointmentDetails = data.appointmentDetails
      toast.success(
        `Appointment scheduled with ${data.contractor.business} for ${new Date(appointmentDetails.date).toLocaleDateString()}`,
        { duration: 6000 }
      )
      
    } catch (error: any) {
      console.error('Appointment scheduling failed:', error)
      toast.error('Failed to schedule appointment: ' + (error.message || 'Unknown error'))
    } finally {
      setIsScheduling(false)
    }
  }

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 9) return 'text-red-600'
    if (urgency >= 7) return 'text-orange-600'
    if (urgency >= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lead Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const latestAssessment = assessments[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Assessment Results</h1>
                  <p className="text-sm text-gray-600">Lead ID: {leadId?.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLeadStatusColor(lead.qualification_status)}`}>
                {lead.qualification_status.toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Lead Score</p>
                <p className="text-lg font-bold text-blue-600">{lead.lead_score}/100</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lead Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Lead Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-800">{lead.contact_name}</p>
                  <p className="text-sm text-gray-600">{lead.contact_email}</p>
                  <p className="text-sm text-gray-600">{formatPhoneNumber(lead.contact_phone)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-semibold text-gray-800">{lead.property_address}</p>
                  <p className="text-sm text-gray-600">{lead.city}, {lead.state} {lead.zip_code}</p>
                  <p className="text-sm text-gray-600 capitalize">{lead.property_type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Damage Details</p>
                  <p className="font-semibold text-gray-800">{lead.damage_type}</p>
                  <p className={`text-sm font-medium ${getUrgencyColor(lead.urgency_level)}`}>
                    Urgency: {lead.urgency_level}/10
                  </p>
                  <p className="text-sm text-gray-600">{lead.damage_description}</p>
                </div>
                
                {lead.has_insurance && (
                  <div>
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="font-semibold text-gray-800">{lead.insurance_company}</p>
                    <p className="text-sm text-gray-600">
                      Claim {lead.claim_filed ? 'Filed' : 'Not Filed'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assessment Summary */}
            {latestAssessment && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">AI Assessment</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${latestAssessment.confidence_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(latestAssessment.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Cost Estimate</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(latestAssessment.estimated_cost_min)} - {formatCurrency(latestAssessment.estimated_cost_max)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Insurance Claim Probability</p>
                    <p className="text-lg font-bold text-green-600">
                      {Math.round(latestAssessment.insurance_claim_probability * 100)}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Priority Level</p>
                    <div className="flex items-center space-x-2">
                      {latestAssessment.priority_level === 'emergency' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {latestAssessment.priority_level === 'high' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      {latestAssessment.priority_level === 'medium' && <Clock className="h-4 w-4 text-yellow-600" />}
                      {latestAssessment.priority_level === 'low' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <span className="font-semibold text-gray-800 capitalize">
                        {latestAssessment.priority_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Matched Contractors */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Matched Contractors</h2>
              <p className="text-gray-600 mb-6">
                Based on your location, damage type, and requirements, here are the top-rated contractors:
              </p>
              
              {contractors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading contractors...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contractors.map((contractor) => (
                    <div 
                      key={contractor.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedContractor?.id === contractor.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContractor(contractor)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-800">{contractor.business_name}</h3>
                            {contractor.is_verified && (
                              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                <CheckCircle className="h-3 w-3" />
                                <span>Verified</span>
                              </div>
                            )}
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {contractor.matchScore}% Match
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{contractor.contact_name}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{formatPhoneNumber(contractor.contact_phone)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{contractor.contact_email}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{contractor.city}, {contractor.state}</span>
                            <span>•</span>
                            <span>{contractor.service_radius} mile radius</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {renderStarRating(contractor.rating)}
                              <span className="text-sm text-gray-600">
                                {contractor.total_jobs} jobs completed
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {contractor.response_time_hours}h response
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                contractor.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                                contractor.availability_status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {contractor.availability_status}
                              </div>
                            </div>
                          </div>
                          
                          {contractor.specialties && contractor.specialties.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">Specialties:</p>
                              <div className="flex flex-wrap gap-1">
                                {contractor.specialties.slice(0, 3).map((specialty, index) => (
                                  <span 
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col items-center">
                          {contractor.insurance_verified && (
                            <div className="mb-2" title="Insurance Verified">
                              <Shield className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {contractor.background_checked && (
                            <div className="mb-2" title="Background Checked">
                              <Award className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule Appointment */}
            {selectedContractor && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule Appointment</h2>
                <p className="text-gray-600 mb-6">
                  Schedule an appointment with {selectedContractor.business_name}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="inspection">Inspection</option>
                      <option value="estimate">Estimate</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific requirements or notes for the contractor..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <button
                      onClick={scheduleAppointment}
                      disabled={isScheduling || !appointmentDate}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isScheduling ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5" />
                          <span>Schedule Appointment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDashboard
