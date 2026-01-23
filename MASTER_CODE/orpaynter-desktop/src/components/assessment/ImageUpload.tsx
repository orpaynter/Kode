import { useState, useCallback } from 'react'
import { Upload, X, Image, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAppStore } from '../../store'
import { assessRoofDamage } from '../../services/openai'

const ImageUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const { assessment, addAssessmentImage, clearAssessmentImages, setAssessmentResults, setAssessmentProcessing } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [])
  
  const handleFiles = (files: FileList) => {
    // Process each file and convert to base64 for preview
    Array.from(files).forEach(file => {
      if (!file.type.match('image.*')) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          addAssessmentImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  
  const handleProcessImages = async () => {
    if (assessment.images.length === 0) return
    
    setIsProcessing(true)
    setAssessmentProcessing(true)
    
    try {
      // In a real app, we'd process all images, but for demo just use the first one
      const result = await assessRoofDamage(assessment.images[0])
      setAssessmentResults(result)
    } catch (error) {
      console.error('Error processing images:', error)
      // Handle error appropriately
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Roof Images</h3>
        {assessment.images.length > 0 && (
          <button 
            onClick={clearAssessmentImages}
            className="text-sm text-red-500 hover:text-red-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" /> Clear all
          </button>
        )}
      </div>
      
      {assessment.images.length === 0 ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-orpaynter-deep-blue bg-blue-50' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="mb-2">Drag and drop roof photos here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="btn-primary cursor-pointer">
            <span>Browse Files</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <p className="mt-4 text-xs text-gray-500">
            Supported formats: JPG, PNG, WebP. Max size: 10MB
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assessment.images.map((image, index) => (
              <div key={index} className="glass-panel p-2 relative group">
                <img 
                  src={image} 
                  alt={`Roof image ${index + 1}`} 
                  className="w-full h-48 object-cover rounded"
                />
                <button 
                  onClick={() => {
                    const updatedImages = [...assessment.images]
                    updatedImages.splice(index, 1)
                    clearAssessmentImages()
                    updatedImages.forEach(img => addAssessmentImage(img))
                  }}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
            
            <label className="glass-panel p-8 flex flex-col items-center justify-center cursor-pointer h-48">
              <Image className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm">Add More</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              className="btn-primary px-8 py-3"
              onClick={handleProcessImages}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Analyze Roof Damage'}
            </button>
          </div>
          
          {/* Results Section */}
          {assessment.results && (
            <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-white/50">
              <h3 className="text-lg font-semibold mb-4">Assessment Results</h3>
              
              <div className="flex items-center mb-4">
                {assessment.results.damageDetected ? (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Damage Detected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">No Significant Damage Detected</span>
                  </div>
                )}
                
                <div className="ml-auto">
                  <span className="text-sm text-gray-500">Confidence: </span>
                  <span className="font-medium">{(assessment.results.assessmentAccuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              {assessment.results.damageDetected && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Damage Type</p>
                      <p className="font-medium">{assessment.results.damageType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{assessment.results.damageLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Urgency</p>
                      <p className={`font-medium capitalize ${
                        assessment.results.urgency === 'critical' ? 'text-red-600' :
                        assessment.results.urgency === 'high' ? 'text-orange-500' :
                        assessment.results.urgency === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {assessment.results.urgency}
                      </p>
                    </div>
                  </div>
                  
                  {assessment.results.estimatedCost.max > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Estimated Repair Cost</p>
                      <p className="font-semibold text-lg">
                        ${assessment.results.estimatedCost.min.toLocaleString()} - ${assessment.results.estimatedCost.max.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        *Estimate based on visible damage. Professional inspection recommended for accurate assessment.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Recommendations</p>
                <ul className="list-disc pl-5 space-y-1">
                  {assessment.results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ImageUpload
