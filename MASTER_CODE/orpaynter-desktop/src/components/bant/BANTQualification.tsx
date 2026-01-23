import { useState } from 'react'
import { MessageSquare, ArrowRight, CheckCircle, Star, AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store'

type BANTStep = 'intro' | 'budget' | 'authority' | 'need' | 'timeline' | 'contact' | 'processing' | 'complete'

// Enhanced BANT scoring system
interface BANTScoring {
  budget: number;
  authority: number;
  need: number;
  timeline: number;
  overall: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  priority: 'hot' | 'warm' | 'cold';
}

const calculateBANTScore = (lead: any): BANTScoring => {
  let budgetScore = 0;
  let authorityScore = 0;
  let needScore = 0;
  let timelineScore = 0;

  // Budget scoring (0-25 points)
  if (lead.budget) {
    const budget = lead.budget.toLowerCase();
    if (budget.includes('$50,000') || budget.includes('50k') || budget.includes('unlimited') || budget.includes('no limit')) {
      budgetScore = 25;
    } else if (budget.includes('$25,000') || budget.includes('25k') || budget.includes('$30,000') || budget.includes('30k')) {
      budgetScore = 20;
    } else if (budget.includes('$15,000') || budget.includes('15k') || budget.includes('$20,000') || budget.includes('20k')) {
      budgetScore = 15;
    } else if (budget.includes('$10,000') || budget.includes('10k') || budget.includes('$5,000') || budget.includes('5k')) {
      budgetScore = 10;
    } else if (budget.includes('flexible') || budget.includes('depends') || budget.includes('varies')) {
      budgetScore = 8;
    } else {
      budgetScore = 5;
    }
  }

  // Authority scoring (0-25 points)
  if (lead.authority) {
    const authority = lead.authority.toLowerCase();
    if (authority.includes('homeowner') || authority.includes('property owner') || authority.includes('sole decision') || authority.includes('i am')) {
      authorityScore = 25;
    } else if (authority.includes('spouse') || authority.includes('partner') || authority.includes('joint decision')) {
      authorityScore = 20;
    } else if (authority.includes('committee') || authority.includes('board') || authority.includes('family decision')) {
      authorityScore = 15;
    } else if (authority.includes('need approval') || authority.includes('have to ask') || authority.includes('landlord')) {
      authorityScore = 8;
    } else {
      authorityScore = 10;
    }
  }

  // Need scoring (0-25 points)
  if (lead.need) {
    const need = lead.need.toLowerCase();
    if (need.includes('leak') || need.includes('storm') || need.includes('damage') || need.includes('emergency') || need.includes('urgent')) {
      needScore = 25;
    } else if (need.includes('replace') || need.includes('new roof') || need.includes('full replacement')) {
      needScore = 22;
    } else if (need.includes('repair') || need.includes('fix') || need.includes('maintenance')) {
      needScore = 18;
    } else if (need.includes('inspection') || need.includes('assessment') || need.includes('estimate')) {
      needScore = 12;
    } else if (need.includes('planning') || need.includes('future') || need.includes('considering')) {
      needScore = 8;
    } else {
      needScore = 10;
    }
  }

  // Timeline scoring (0-25 points)
  if (lead.timeline) {
    const timeline = lead.timeline.toLowerCase();
    if (timeline.includes('immediately') || timeline.includes('asap') || timeline.includes('emergency') || timeline.includes('right away')) {
      timelineScore = 25;
    } else if (timeline.includes('week') || timeline.includes('2 weeks') || timeline.includes('this month')) {
      timelineScore = 22;
    } else if (timeline.includes('month') || timeline.includes('30 days') || timeline.includes('next month')) {
      timelineScore = 18;
    } else if (timeline.includes('season') || timeline.includes('spring') || timeline.includes('summer') || timeline.includes('3 months')) {
      timelineScore = 15;
    } else if (timeline.includes('year') || timeline.includes('6 months') || timeline.includes('planning')) {
      timelineScore = 10;
    } else {
      timelineScore = 8;
    }
  }

  const overall = budgetScore + authorityScore + needScore + timelineScore;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  let priority: 'hot' | 'warm' | 'cold';
  
  if (overall >= 85) {
    grade = 'A';
    priority = 'hot';
  } else if (overall >= 70) {
    grade = 'B';
    priority = 'hot';
  } else if (overall >= 55) {
    grade = 'C';
    priority = 'warm';
  } else if (overall >= 40) {
    grade = 'D';
    priority = 'warm';
  } else {
    grade = 'F';
    priority = 'cold';
  }

  return {
    budget: budgetScore,
    authority: authorityScore,
    need: needScore,
    timeline: timelineScore,
    overall,
    grade,
    priority
  };
};

const BANTQualification = () => {
  const [currentStep, setCurrentStep] = useState<BANTStep>('intro')
  const [chatMessages, setChatMessages] = useState<{role: 'system' | 'user', content: string}[]>([
    { role: 'system', content: 'Hello! I\'m your OrPaynter qualification assistant. I\'ll help assess your roofing project using our BANT system to ensure we match you with the best contractor for your needs.' }
  ])
  const [leadScore, setLeadScore] = useState<BANTScoring | null>(null);
  
  const { leadQualification, updateCurrentLead, saveLead } = useAppStore()
  
  const addMessage = (role: 'system' | 'user', content: string) => {
    setChatMessages(prev => [...prev, { role, content }])
  }
  
  const handleUserInput = (input: string) => {
    addMessage('user', input)
    
    // Process based on current step
    switch(currentStep) {
      case 'intro':
        setTimeout(() => {
          addMessage('system', 'Great! Let\'s start with your budget. What\'s the approximate budget for your roofing project?')
          setCurrentStep('budget')
        }, 500)
        break
        
      case 'budget':
        updateCurrentLead({ budget: input })
        setTimeout(() => {
          addMessage('system', 'Thank you. Are you the decision maker for this project, or will others be involved in the decision?')
          setCurrentStep('authority')
        }, 500)
        break
        
      case 'authority':
        updateCurrentLead({ authority: input })
        setTimeout(() => {
          addMessage('system', 'Got it. What specific roofing needs do you have? (e.g., repair, replacement, inspection after storm damage)')
          setCurrentStep('need')
        }, 500)
        break
        
      case 'need':
        updateCurrentLead({ need: input })
        setTimeout(() => {
          addMessage('system', 'What\'s your timeline for this project?')
          setCurrentStep('timeline')
        }, 500)
        break
        
      case 'timeline':
        updateCurrentLead({ timeline: input })
        setTimeout(() => {
          addMessage('system', 'Thank you. To complete your qualification, I need your contact information. What\'s your name?')
          setCurrentStep('contact')
        }, 500)
        break
        
      case 'contact':
        // Assuming format: "Name, email@example.com, phone"
        const parts = input.split(',').map(part => part.trim())
        updateCurrentLead({ 
          name: parts[0] || null,
          email: parts[1] || null, 
          phone: parts[2] || null 
        })
        
        setTimeout(() => {
          addMessage('system', 'Perfect! I\'m now processing your information and calculating your lead score based on our comprehensive BANT qualification system...')
          setCurrentStep('processing')
          
          // Calculate BANT score
          setTimeout(() => {
            const score = calculateBANTScore(leadQualification.currentLead);
            setLeadScore(score);
            
            // Update lead with score
            updateCurrentLead({ score: score.overall });
            saveLead();
            
            // Provide personalized response based on score
            let responseMessage = '';
            if (score.grade === 'A' || score.grade === 'B') {
              responseMessage = `Excellent! You\'re a Grade ${score.grade} lead with a score of ${score.overall}/100. You\'re a ${score.priority} priority prospect. Our premium contractors will contact you within 24 hours to discuss your ${leadQualification.currentLead.need} project.`;
            } else if (score.grade === 'C') {
              responseMessage = `Great! You\'re a Grade ${score.grade} lead with a score of ${score.overall}/100. We\'ll match you with qualified contractors who can work within your timeline and budget for your ${leadQualification.currentLead.need} project.`;
            } else {
              responseMessage = `Thank you for your interest! Based on your responses (Grade ${score.grade}, ${score.overall}/100), we\'ll keep your information on file and contact you when we have contractors available that match your specific needs and timeline.`;
            }
            
            addMessage('system', responseMessage);
            setCurrentStep('complete');
          }, 3000);
        }, 1000)
        break
      
      default:
        break
    }
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white/50">
          <h3 className="font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orpaynter-deep-blue" />
            Lead Qualification Assistant
          </h3>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
          {chatMessages.map((message, i) => (
            <div 
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' 
                  ? 'bg-orpaynter-deep-blue text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {currentStep === 'complete' && (
            <div className="space-y-4">
              <div className="flex justify-center my-6">
                <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span>Lead successfully qualified and saved!</span>
                </div>
              </div>
              
              {leadScore && (
                <div className="glass-panel p-4 mt-4">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    BANT Score Breakdown
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        leadScore.grade === 'A' ? 'text-green-600' :
                        leadScore.grade === 'B' ? 'text-blue-600' :
                        leadScore.grade === 'C' ? 'text-yellow-600' :
                        leadScore.grade === 'D' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {leadScore.grade}
                      </div>
                      <p className="text-sm text-gray-500">Grade</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orpaynter-deep-blue">
                        {leadScore.overall}/100
                      </div>
                      <p className="text-sm text-gray-500">Score</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget</span>
                      <span className="font-medium">{leadScore.budget}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Authority</span>
                      <span className="font-medium">{leadScore.authority}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Need</span>
                      <span className="font-medium">{leadScore.need}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Timeline</span>
                      <span className="font-medium">{leadScore.timeline}/25</span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg text-center ${
                    leadScore.priority === 'hot' ? 'bg-red-100 text-red-800' :
                    leadScore.priority === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <span className="font-medium capitalize">{leadScore.priority} Priority Lead</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input area */}
        {currentStep !== 'complete' && currentStep !== 'processing' && (
          <div className="p-4 border-t border-gray-200 bg-white/50">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const input = (e.target as HTMLFormElement).userInput.value
                if (input.trim()) {
                  handleUserInput(input.trim())
                  ;(e.target as HTMLFormElement).reset()
                }
              }}
              className="flex items-center space-x-2"
            >
              <input 
                type="text" 
                name="userInput"
                placeholder={currentStep === 'intro' 
                  ? "Type 'start' to begin the qualification process"
                  : "Type your response here..."}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orpaynter-deep-blue"
                disabled={currentStep === 'processing'}
              />
              <button 
                type="submit"
                className="bg-orpaynter-deep-blue text-white p-2 rounded-lg hover:bg-orpaynter-deep-blue/90 transition-colors"
                disabled={currentStep === 'processing'}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Guidance */}
      <div className="mt-4 text-sm text-gray-500">
        <p>The BANT qualification system assesses leads based on:</p>
        <ul className="list-disc pl-5 mt-1">
          <li><strong>Budget:</strong> Financial capacity for the project</li>
          <li><strong>Authority:</strong> Decision-making capability</li>
          <li><strong>Need:</strong> Specific requirements and urgency</li>
          <li><strong>Timeline:</strong> Expected project timeframe</li>
        </ul>
      </div>
    </div>
  )
}

export default BANTQualification
