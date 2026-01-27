import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { ArrowLeft, Upload, Camera, CheckCircle, AlertTriangle, Eye, Download, Clock, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

interface AnalysisResult {
  damageTypes: string[]
  severity: string
  confidenceScore: number
  estimatedCostMin: number
  estimatedCostMax: number
  insuranceClaimProbability: number
  priorityLevel: string
  description: string
  recommendations: string[]
}

interface Assessment {
  id: string
  photo_url: string
  ai_analysis_result: AnalysisResult
  confidence_score: number
  estimated_cost_min: number
  estimated_cost_max: number
  insurance_claim_probability: number
  priority_level: string
  processing_time_seconds: number
  analysis_status: string
}

const DamageAssessment: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const leadId = searchParams.get('leadId')
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<Assessment | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState('')

  useEffect(() => {
    if (!leadId) {
      toast.error('No lead ID provided. Redirecting to start.')
      navigate('/')
    }
  }, [leadId, navigate])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for image files only
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Please upload image files only (JPG, PNG, etc.)')
    }
    
    setUploadedFiles(prev => [...prev, ...imageFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisStage('Uploading photo...')
    
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setAnalysisProgress(25)
      setAnalysisStage('Analyzing damage with AI...')

      const fileName = `${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.functions.invoke('ai-damage-assessment', {
        body: {
          imageData: base64,
          fileName,
          leadId
        }
      })

      if (error) throw error

      setAnalysisProgress(75)
      setAnalysisStage('Processing results...')

      const assessment = data.assessment
      setCurrentAnalysis(assessment)
      setAssessments(prev => [...prev, assessment])

      setAnalysisProgress(100)
      setAnalysisStage('Analysis complete!')
      
      toast.success(`Analysis completed in ${data.processingTime} seconds!`)
      
    } catch (error: any) {
      console.error('Analysis failed:', error)
      toast.error('Analysis failed: ' + (error.message || 'Unknown error'))
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisProgress(0)
        setAnalysisStage('')
      }, 1000)
    }
  }

  const handleContinueToResults = () => {
    if (leadId) {
      navigate(`/results/${leadId}`)
    }
  }

  const getDamageTypeColor = (damageType: string) => {
    const type = damageType.toLowerCase()
    if (type.includes('hail')) return 'bg-purple-100 text-purple-800'
    if (type.includes('wind')) return 'bg-blue-100 text-blue-800'
    if (type.includes('leak')) return 'bg-red-100 text-red-800'
    if (type.includes('structural')) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'emergency': return 'text-red-600 bg-red-100'
      case 'severe': return 'text-orange-600 bg-orange-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'minor': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />
      default: return <Eye className="h-5 w-5 text-gray-600" />
    }
  }

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
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">AI Damage Assessment</h1>
                  <p className="text-sm text-gray-600">95% accuracy • 30-second analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Roof Photos</h2>
              <p className="text-gray-600 mb-6">
                Take clear photos of your roof damage from multiple angles. Our AI will analyze them instantly.
              </p>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, WebP (max 10MB each)</p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Uploaded Photos ({uploadedFiles.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 truncate">{file.name}</p>
                          <button
                            onClick={() => analyzePhoto(file)}
                            disabled={isAnalyzing}
                            className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs transition-colors disabled:opacity-50"
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="font-medium text-blue-800">{analysisStage}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">{analysisProgress}% complete</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Photo Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Take photos in good lighting conditions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Capture damage from multiple angles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include close-up shots of specific damage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Show overall roof condition for context</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {currentAnalysis ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(currentAnalysis.priority_level)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(currentAnalysis.ai_analysis_result.severity)}`}>
                      {currentAnalysis.ai_analysis_result.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round(currentAnalysis.confidence_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${currentAnalysis.confidence_score * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Damage Types */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Detected Damage Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentAnalysis.ai_analysis_result.damageTypes.map((type, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDamageTypeColor(type)}`}
                      >
                        {type.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Cost Estimate</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(currentAnalysis.estimated_cost_min)} - {formatCurrency(currentAnalysis.estimated_cost_max)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Estimated repair cost range</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Probability */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Insurance Claim Probability</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            currentAnalysis.insurance_claim_probability > 0.7 ? 'bg-green-500' :
                            currentAnalysis.insurance_claim_probability > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${currentAnalysis.insurance_claim_probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {Math.round(currentAnalysis.insurance_claim_probability * 100)}%
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Analysis Summary</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentAnalysis.ai_analysis_result.description}
                  </p>
                </div>

                {/* Recommendations */}
                {currentAnalysis.ai_analysis_result.recommendations && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {currentAnalysis.ai_analysis_result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Processing Time */}
                <div className="text-center border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Analysis completed in {currentAnalysis.processing_time_seconds} seconds
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Photos to Begin</h3>
                <p className="text-gray-600">
                  Our AI will analyze your roof damage and provide detailed assessment results.
                </p>
              </div>
            )}

            {/* Continue Button */}
            {assessments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
                <p className="text-gray-600 mb-4">
                  Your damage assessment is complete. Continue to see matched contractors and schedule inspections.
                </p>
                <button
                  onClick={handleContinueToResults}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue to Results</span>
                  <ArrowLeft className="h-5 w-5 transform rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DamageAssessment
