import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Camera,
  Zap,
  Brain,
  FileImage,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  BarChart3,
  Download,
  Trash2,
  Eye,
  X,
  Loader2,
  MapPin,
  CalendarDays
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadedImage {
  id: string
  file: File
  preview: string
  analysis?: AIAnalysisResult
  analyzing: boolean
}

interface AIAnalysisResult {
  damage_types: string[]
  confidence_score: number
  estimated_cost_min: number
  estimated_cost_max: number
  priority_level: 'low' | 'medium' | 'high' | 'critical'
  insurance_claim_probability: number
  detailed_findings: {
    area: string
    damage_type: string
    severity: string
    description: string
  }[]
  recommendations: string[]
  processing_time_seconds: number
}

export function AIAgents() {
  const { user } = useAuth()
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return
    
    const newImages: UploadedImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      analyzing: false
    }))
    
    setUploadedImages(prev => [...prev, ...newImages])
    toast.success(`${files.length} image(s) uploaded successfully!`)
  }

  const analyzeImage = async (image: UploadedImage) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === image.id ? { ...img, analyzing: true } : img
      )
    )

    try {
      // Simulate AI analysis with realistic data
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAnalysis: AIAnalysisResult = {
        damage_types: ['hail_damage', 'missing_shingles', 'gutter_damage'],
        confidence_score: 0.94,
        estimated_cost_min: 3500,
        estimated_cost_max: 7200,
        priority_level: 'high',
        insurance_claim_probability: 0.89,
        detailed_findings: [
          {
            area: 'North-facing slope',
            damage_type: 'Hail damage',
            severity: 'Moderate',
            description: 'Multiple granule loss areas consistent with hail impact patterns'
          },
          {
            area: 'Ridge line',
            damage_type: 'Missing shingles',
            severity: 'High',
            description: '3-4 shingles completely missing, exposing underlayment'
          },
          {
            area: 'West gutter system',
            damage_type: 'Gutter damage',
            severity: 'Moderate',
            description: 'Dents and separation joints visible in gutter sections'
          }
        ],
        recommendations: [
          'Schedule immediate inspection with qualified roofing contractor',
          'Document all damage areas with additional photos for insurance claim',
          'Install temporary tarping over exposed areas if rain is expected',
          'Contact insurance company within 48 hours to file claim',
          'Obtain at least 3 contractor estimates for repair work'
        ],
        processing_time_seconds: 2.8
      }

      setUploadedImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, analyzing: false, analysis: mockAnalysis }
            : img
        )
      )
      
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === image.id ? { ...img, analyzing: false } : img
        )
      )
      toast.error('Analysis failed. Please try again.')
    }
  }

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter(img => img.id !== imageId)
    })
    
    if (selectedImage?.id === imageId) {
      setSelectedImage(null)
      setShowResults(false)
    }
  }

  const viewResults = (image: UploadedImage) => {
    setSelectedImage(image)
    setShowResults(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20'
      case 'high': return 'bg-orange-500/20'
      case 'medium': return 'bg-yellow-500/20'
      case 'low': return 'bg-green-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const downloadReport = (analysis: AIAnalysisResult) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      analysis: analysis,
      user: user?.email
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `roof-analysis-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Report downloaded successfully!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">AI-Powered Roof Analysis</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload photos of your roof damage and get instant AI-powered analysis with detailed findings, 
          cost estimates, and recommendations.
        </p>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: Brain,
            title: 'Advanced AI Analysis',
            description: '94%+ accuracy in damage detection using computer vision',
            color: 'bg-purple-500/20 text-purple-400'
          },
          {
            icon: DollarSign,
            title: 'Cost Estimation',
            description: 'Instant repair cost estimates based on market data',
            color: 'bg-green-500/20 text-green-400'
          },
          {
            icon: BarChart3,
            title: 'Insurance Insights',
            description: 'Claim probability assessment and documentation',
            color: 'bg-blue-500/20 text-blue-400'
          }
        ].map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          )
        })}
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8"
      >
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-500/20 rounded-full">
                <Upload className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragging ? 'Drop images here' : 'Upload Roof Photos'}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop images or click to browse. Supports JPG, PNG, WebP formats.
              </p>
              
              <div className="flex justify-center space-x-4">
                <label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                  <FileImage className="h-5 w-5" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                
                <label className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Uploaded Images</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedImages.map((image) => (
              <div key={image.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={image.preview}
                    alt="Uploaded roof photo"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  {image.analyzing && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-2" />
                        <p className="text-white text-sm">Analyzing...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">
                      {image.file.name.substring(0, 20)}...
                    </span>
                    <span className="text-xs text-gray-500">
                      {(image.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                  
                  {!image.analysis && !image.analyzing && (
                    <button
                      onClick={() => analyzeImage(image)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Analyze</span>
                    </button>
                  )}
                  
                  {image.analysis && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Confidence</span>
                        <span className="text-white font-semibold">
                          {Math.round(image.analysis.confidence_score * 100)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Priority</span>
                        <span className={`text-sm font-semibold capitalize ${getPriorityColor(image.analysis.priority_level)}`}>
                          {image.analysis.priority_level}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Est. Cost</span>
                        <span className="text-white font-semibold">
                          {formatCurrency(image.analysis.estimated_cost_min)} - {formatCurrency(image.analysis.estimated_cost_max)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => viewResults(image)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Results</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && selectedImage?.analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">AI Analysis Results</h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => downloadReport(selectedImage.analysis!)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </button>
                    <button
                      onClick={() => setShowResults(false)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div>
                    <img
                      src={selectedImage.preview}
                      alt="Analyzed roof photo"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-sm text-gray-400">Confidence</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {Math.round(selectedImage.analysis.confidence_score * 100)}%
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-400" />
                          <span className="text-sm text-gray-400">Processing Time</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {selectedImage.analysis.processing_time_seconds}s
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-400">Priority Level</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBg(selectedImage.analysis.priority_level)} ${getPriorityColor(selectedImage.analysis.priority_level)}`}>
                            {selectedImage.analysis.priority_level.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-400">Estimated Cost</span>
                          <span className="text-white font-semibold">
                            {formatCurrency(selectedImage.analysis.estimated_cost_min)} - {formatCurrency(selectedImage.analysis.estimated_cost_max)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-400">Insurance Claim Probability</span>
                          <span className="text-green-400 font-semibold">
                            {Math.round(selectedImage.analysis.insurance_claim_probability * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Damage Types */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Detected Damage</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.analysis.damage_types.map((damage, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                          >
                            {damage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Findings */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Detailed Findings</h3>
                  <div className="grid gap-4">
                    {selectedImage.analysis.detailed_findings.map((finding, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="font-medium text-white">{finding.area}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            finding.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                            finding.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-purple-400 font-medium mb-2">{finding.damage_type}</p>
                        <p className="text-gray-300 text-sm">{finding.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {selectedImage.analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Footer */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Generated by OrPaynter AI</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span>AI Confidence: {Math.round(selectedImage.analysis.confidence_score * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}