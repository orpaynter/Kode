import React, { useState, useEffect } from 'react'
import { Image, Download, Trash2, Eye, X } from 'lucide-react'
import { supabaseDataService } from '../services/supabaseData'
import { toast } from 'sonner'

interface PhotoGalleryProps {
  projectId: string
  editable?: boolean
  className?: string
}

interface PhotosByType {
  before: string[]
  during: string[]
  after: string[]
}

export default function PhotoGallery({
  projectId,
  editable = false,
  className = ''
}: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotosByType>({
    before: [],
    during: [],
    after: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before')

  useEffect(() => {
    loadPhotos()
  }, [projectId])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const photoData = await supabaseDataService.getProjectPhotos(projectId)
      setPhotos(photoData)
    } catch (error) {
      console.error('Error loading photos:', error)
      toast.error('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  const downloadPhoto = async (photoUrl: string) => {
    try {
      const response = await fetch(photoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `roof-photo-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Photo downloaded successfully')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download photo')
    }
  }

  const deletePhoto = async (photoUrl: string, photoType: keyof PhotosByType) => {
    try {
      // Extract filename from URL for deletion
      const urlParts = photoUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const fullPath = `projects/${projectId}/roof-photos/${photoType}/${fileName}`
      
      await supabaseDataService.deleteProjectPhoto(fullPath)
      
      // Update local state
      setPhotos(prev => ({
        ...prev,
        [photoType]: prev[photoType].filter(url => url !== photoUrl)
      }))
      
      toast.success('Photo deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete photo')
    }
  }

  const getTabLabel = (type: keyof PhotosByType) => {
    const labels = {
      before: 'Before Work',
      during: 'In Progress',
      after: 'Completed'
    }
    return labels[type]
  }

  const getTabCount = (type: keyof PhotosByType) => {
    return photos[type].length
  }

  const renderPhotoGrid = (photoList: string[], photoType: keyof PhotosByType) => {
    if (photoList.length === 0) {
      return (
        <div className="text-center py-12">
          <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            No {photoType} photos yet
          </p>
          <p className="text-gray-400 text-sm">
            {photoType === 'before' && 'Upload photos before work begins'}
            {photoType === 'during' && 'Document progress during the project'}
            {photoType === 'after' && 'Show the completed work'}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photoList.map((photoUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer">
              <img
                src={photoUrl}
                alt={`${photoType} photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onClick={() => setSelectedPhoto(photoUrl)}
              />
            </div>
            
            {/* Action buttons overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPhoto(photoUrl)
                  }}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="View full size"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadPhoto(photoUrl)
                  }}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="Download photo"
                >
                  <Download className="h-4 w-4 text-gray-700" />
                </button>
                
                {editable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePhoto(photoUrl, photoType)
                    }}
                    className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Delete photo"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Photo number indicator */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex space-x-4 mb-6">
            {['before', 'during', 'after'].map((tab) => (
              <div key={tab} className="h-10 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {(['before', 'during', 'after'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabLabel(tab)}
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {getTabCount(tab)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Photo Grid */}
      <div className="min-h-[400px]">
        {renderPhotoGrid(photos[activeTab], activeTab)}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <img
              src={selectedPhoto}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
              <button
                onClick={() => downloadPhoto(selectedPhoto)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}