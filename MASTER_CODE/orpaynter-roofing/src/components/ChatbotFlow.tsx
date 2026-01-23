import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Phone, AlertTriangle, Shield, User, Building, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPhoneNumber, getBudgetRangeOptions, getTimelineOptions, getRoofMaterialOptions } from '../lib/utils'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  type: 'bot' | 'user'
  content: string
  options?: string[]
  inputType?: 'text' | 'select' | 'radio' | 'phone' | 'email'
  field?: string
}

interface LeadData {
  userType?: 'homeowner' | 'contractor' | 'insurance_professional'
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  property_address?: string
  city?: string
  state?: string
  zip_code?: string
  property_type?: 'residential' | 'commercial'
  damage_type?: string
  damage_severity?: 'minor' | 'moderate' | 'severe' | 'emergency'
  damage_description?: string
  urgency_level?: number
  has_insurance?: boolean
  insurance_company?: string
  claim_filed?: boolean
  is_decision_maker?: boolean
  budget_range?: string
  roof_age?: number
  roof_material?: string
  square_footage?: number
  timeline?: string
}

const ChatbotFlow: React.FC = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [leadData, setLeadData] = useState<LeadData>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Initial greeting
    addMessage({
      id: Date.now().toString(),
      type: 'bot',
      content: 'Welcome to OrPaynter! I\'m here to help you get connected with the right roofing professionals. First, let me understand who you are:',
      options: ['Homeowner', 'Contractor', 'Insurance Professional'],
      inputType: 'radio',
      field: 'userType'
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const handleUserResponse = (value: string, field?: string) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: value
    })

    // Update lead data
    if (field) {
      setLeadData(prev => ({ ...prev, [field]: value }))
    }

    // Process next step
    setTimeout(() => {
      processNextStep(value, field)
    }, 500)
  }

  const processNextStep = (value: string, field?: string) => {
    // Create updated data object that includes the new field
    let updatedData = { ...leadData }
    if (field) {
      updatedData[field] = value
    }

    switch (field) {
      case 'userType':
        if (value === 'Homeowner') {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Perfect! I\'ll help you assess your roof damage and connect you with qualified contractors. Let\'s start with your contact information. What\'s your full name?',
            inputType: 'text',
            field: 'contact_name'
          })
        } else if (value === 'Contractor') {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Great! Are you looking to join our verified contractor network or need support with existing leads?',
            options: ['Join Network', 'Lead Support'],
            inputType: 'radio',
            field: 'contractor_inquiry'
          })
        } else {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Welcome! Are you here to review a claim, verify damage assessment, or support a policyholder?',
            options: ['Review Claim', 'Verify Assessment', 'Support Policyholder'],
            inputType: 'radio',
            field: 'insurance_inquiry'
          })
        }
        break

      case 'contact_name':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: `Nice to meet you, ${value}! What\'s the best email address to reach you?`,
          inputType: 'email',
          field: 'contact_email'
        })
        break

      case 'contact_email':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'And your phone number for urgent updates?',
          inputType: 'phone',
          field: 'contact_phone'
        })
        break

      case 'contact_phone':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What\'s the address of the property that needs assessment?',
          inputType: 'text',
          field: 'property_address'
        })
        break

      case 'property_address':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Which city is this property located in?',
          inputType: 'text',
          field: 'city'
        })
        break

      case 'city':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What state? (2-letter code, e.g., TX)',
          inputType: 'text',
          field: 'state'
        })
        break

      case 'state':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'ZIP code?',
          inputType: 'text',
          field: 'zip_code'
        })
        break

      case 'zip_code':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Is this a residential or commercial property?',
          options: ['Residential', 'Commercial'],
          inputType: 'radio',
          field: 'property_type'
        })
        break

      case 'property_type':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What type of damage are you seeing? (e.g., hail damage, wind damage, leaks, missing shingles)',
          inputType: 'text',
          field: 'damage_type'
        })
        break

      case 'damage_type':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'How would you describe the severity of the damage?',
          options: ['Minor (small issues, not urgent)', 'Moderate (noticeable damage)', 'Severe (significant damage)', 'Emergency (immediate attention needed)'],
          inputType: 'radio',
          field: 'damage_severity'
        })
        break

      case 'damage_severity':
        const severity = value.toLowerCase().split(' ')[0] as 'minor' | 'moderate' | 'severe' | 'emergency'
        updatedData.damage_severity = severity
        
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Can you describe the damage in more detail? This helps our AI provide better analysis.',
          inputType: 'text',
          field: 'damage_description'
        })
        break

      case 'damage_description':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'On a scale of 1-10, how urgent is this repair? (1 = can wait, 10 = emergency)',
          inputType: 'text',
          field: 'urgency_level'
        })
        break

      case 'urgency_level':
        const urgency = parseInt(value)
        updatedData.urgency_level = urgency
        
        if (urgency >= 9) {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'EMERGENCY DETECTED! I\'ll prioritize your case for immediate callback. Do you have insurance that might cover this damage?',
            options: ['Yes', 'No', 'Not sure'],
            inputType: 'radio',
            field: 'has_insurance'
          })
        } else {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Do you have homeowner\'s insurance that might cover this damage?',
            options: ['Yes', 'No', 'Not sure'],
            inputType: 'radio',
            field: 'has_insurance'
          })
        }
        break

      case 'has_insurance':
        const hasInsurance = value === 'Yes'
        updatedData.has_insurance = hasInsurance
        
        if (hasInsurance) {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Great! Which insurance company?',
            inputType: 'text',
            field: 'insurance_company'
          })
        } else {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Are you the decision-maker for this property, or will someone else be involved in choosing a contractor?',
            options: ['I make the decisions', 'Someone else decides', 'Joint decision'],
            inputType: 'radio',
            field: 'is_decision_maker'
          })
        }
        break

      case 'insurance_company':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Have you already filed a claim for this damage?',
          options: ['Yes', 'No', 'Planning to'],
          inputType: 'radio',
          field: 'claim_filed'
        })
        break

      case 'claim_filed':
        const claimFiled = value === 'Yes'
        updatedData.claim_filed = claimFiled
        
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Are you the decision-maker for this property, or will someone else be involved in choosing a contractor?',
          options: ['I make the decisions', 'Someone else decides', 'Joint decision'],
          inputType: 'radio',
          field: 'is_decision_maker'
        })
        break

      case 'is_decision_maker':
        const isDecisionMaker = value === 'I make the decisions'
        updatedData.is_decision_maker = isDecisionMaker
        
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What\'s your budget range for this repair?',
          options: getBudgetRangeOptions(),
          inputType: 'select',
          field: 'budget_range'
        })
        break

      case 'budget_range':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'How old is your roof (approximately)?',
          inputType: 'text',
          field: 'roof_age'
        })
        break

      case 'roof_age':
        const roofAge = parseInt(value)
        updatedData.roof_age = roofAge
        
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What type of roofing material do you have?',
          options: getRoofMaterialOptions(),
          inputType: 'select',
          field: 'roof_material'
        })
        break

      case 'roof_material':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'What\'s your timeline for getting this work done?',
          options: getTimelineOptions(),
          inputType: 'select',
          field: 'timeline'
        })
        break

      case 'timeline':
        // Final step - qualify the lead with complete data
        handleLeadQualification(updatedData)
        break

      case 'contractor_inquiry':
        if (value === 'Join Network') {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Excellent! To join our verified contractor network, please call us at (469) 479-2526 or email contractors@orpaynter.com. Our team will walk you through the verification process.'
          })
        } else {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'For contractor support and lead assistance, please call (469) 479-2526 or access your contractor portal.'
          })
        }
        break

      case 'insurance_inquiry':
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'For insurance professional services, please contact our claims support team at (469) 479-2526 or claims@orpaynter.com.'
        })
        break
        
      case 'retry_qualification':
        if (value === 'Yes, try again') {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'Let me try processing your lead qualification again with the information you provided...'
          })
          // Retry the qualification with the existing data
          setTimeout(() => {
            handleLeadQualification(updatedData)
          }, 1000)
        } else {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: 'That\'s perfectly fine! Our team is standing by to assist you personally. Please call (469) 479-2526 and mention your case ID: ' + Date.now().toString().slice(-8) + '. We\'ll have all your information ready.'
          })
        }
        break
    }
    
    // Update the lead data state with the accumulated data
    setLeadData(updatedData)
  }

  const handleLeadQualification = async (finalData: LeadData) => {
    setIsLoading(true)
    
    console.log('=== FRONTEND LEAD QUALIFICATION START ===')
    console.log('Final data being sent:', JSON.stringify(finalData, null, 2))
    
    addMessage({
      id: Date.now().toString(),
      type: 'bot',
      content: 'Perfect! I\'m now processing your information and calculating your lead score based on our BANT qualification system...'
    })

    try {
      const requestBody = {
        ...finalData,
        property_type: finalData.property_type?.toLowerCase(),
        damage_severity: finalData.damage_severity
      }
      
      console.log('Request body after transformation:', JSON.stringify(requestBody, null, 2))
      
      const { data, error } = await supabase.functions.invoke('qualify-lead', {
        body: requestBody
      })
      
      console.log('Supabase response - error:', error)
      console.log('Supabase response - data:', JSON.stringify(data, null, 2))

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      const responseData = data.data || data;
      const { lead, leadScore, qualificationStatus, emergencyCallback } = responseData;
      
      console.log('Extracted response values:')
      console.log('- lead:', lead)
      console.log('- leadScore:', leadScore)
      console.log('- qualificationStatus:', qualificationStatus)
      console.log('- emergencyCallback:', emergencyCallback)

      // Show qualification results with enhanced success messaging
      addMessage({
        id: Date.now().toString(),
        type: 'bot',
        content: `🎉 EXCELLENT! Your lead has been successfully qualified and saved!\n\n✅ BANT Score: ${leadScore}/100 (${qualificationStatus.toUpperCase()})\n🆔 Lead ID: ${lead.id}\n\n${emergencyCallback ? '🚨 PRIORITY CASE: Given the emergency nature of your situation, you\'ll receive a callback within 1 hour from our emergency response team!' : '⏰ Perfect! You\'ll be connected with our top-rated, pre-screened contractors within 24 hours.'}\n\n🏆 Your case has been prioritized based on your qualification score and urgency level.`
      })

      toast.success(`🎯 Lead qualified successfully! BANT Score: ${leadScore}/100`, { duration: 5000 })

      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Next step: Let\'s get some photos of your roof damage for AI analysis. This will help contractors provide more accurate estimates.'
        })

        setTimeout(() => {
          navigate(`/assessment?leadId=${lead.id}`)
        }, 2000)
      }, 2000)

    } catch (error) {
      console.log('=== FRONTEND LEAD QUALIFICATION ERROR ===')
      console.error('Lead qualification failed:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.log('=== FRONTEND LEAD QUALIFICATION ERROR END ===')
      
      // Provide specific error messages based on error type
      let errorMessage = 'Lead processing encountered an issue. Please try again or call for immediate assistance.'
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Connection issue detected. Please check your internet connection and try again.'
        toast.error('Network connection issue - please retry')
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Our servers may be busy. Please try again in a moment.'
        toast.error('Request timeout - please retry')
      } else if (error.message?.includes('validation') || error.message?.includes('required')) {
        errorMessage = 'Some required information is missing. Please review your responses and try again.'
        toast.error('Validation error - please check your information')
      } else {
        toast.error('Processing error - our team has been notified')
      }
      
      addMessage({
        id: Date.now().toString(),
        type: 'bot',
        content: `${errorMessage}\n\nFor immediate assistance:\n📞 Call: (469) 479-2526\n📧 Email: support@orpaynter.com\n\nYour information has been securely logged and we'll follow up with you shortly.`
      })
      
      // Offer retry option for non-critical errors
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          content: 'Would you like to try processing your information again?',
          options: ['Yes, try again', 'No, I\'ll call instead'],
          inputType: 'radio',
          field: 'retry_qualification'
        })
      }, 2000)
    } finally {
      setIsLoading(false)
      console.log('=== FRONTEND LEAD QUALIFICATION END ===')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentInput.trim()) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.field) {
      handleUserResponse(currentInput, lastMessage.field)
      setCurrentInput('')
    }
  }

  const handleOptionSelect = (option: string, field?: string) => {
    handleUserResponse(option, field)
  }

  const formatInputValue = (value: string, type?: string) => {
    if (type === 'phone') {
      return formatPhoneNumber(value)
    }
    return value
  }

  const renderInput = (message: ChatMessage) => {
    if (message.type === 'user') return null

    if (message.options && message.inputType === 'radio') {
      return (
        <div className="mt-4 space-y-2">
          {message.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option, message.field)}
              className="block w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              disabled={isLoading}
            >
              {option}
            </button>
          ))}
        </div>
      )
    }

    if (message.options && message.inputType === 'select') {
      return (
        <div className="mt-4">
          <select
            onChange={(e) => handleOptionSelect(e.target.value, message.field)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            defaultValue=""
          >
            <option value="" disabled>Select an option...</option>
            {message.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    }

    return null
  }

  const lastMessage = messages[messages.length - 1]
  const showTextInput = lastMessage && lastMessage.type === 'bot' && 
    ['text', 'email', 'phone'].includes(lastMessage.inputType || '') &&
    !lastMessage.options

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
                <h1 className="text-xl font-bold text-gray-800">OrPaynter AI Assistant</h1>
                <p className="text-sm text-gray-600">Lead Qualification System</p>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">(469) 479-2526</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {renderInput(message)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Processing your lead qualification...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {showTextInput && (
            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type={lastMessage?.inputType === 'email' ? 'email' : lastMessage?.inputType === 'phone' ? 'tel' : 'text'}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(formatInputValue(e.target.value, lastMessage?.inputType))}
                  placeholder="Type your answer..."
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading || !currentInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatbotFlow