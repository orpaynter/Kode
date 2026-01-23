import React, { useState, useRef } from 'react'
import { Upload, X, Image, Loader2 } from 'lucide-react'
import { supabaseDataService } from '../services/supabaseData'
import { toast } from 'sonner'

interface PhotoUploadProps {
  projectId: string
  photoType: 'before' | 'during' | 'after'
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  className?: string
}

interface UploadedPhoto {
  url: string
  fileName: string
  file: File
}

export default function PhotoUpload({
  projectId,
  photoType,
  onUploadComplete,
  maxFiles = 10,
  className = ''
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`)
        return false
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`)
        return false
      }
      
      return true
    })

    if (uploadedPhotos.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadResults = await supabaseDataService.uploadMultipleRoofPhotos(
        validFiles,
        projectId,
        photoType
      )

      const newPhotos: UploadedPhoto[] = uploadResults.map((result, index) => ({
        url: result.publicUrl,
        fileName: result.fileName,
        file: validFiles[index]
      }))

      setUploadedPhotos(prev => [...prev, ...newPhotos])
      
      const allUrls = [...uploadedPhotos, ...newPhotos].map(photo => photo.url)
      onUploadComplete?.(allUrls)
      
      toast.success(`${validFiles.length} photo(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload photos. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removePhoto = async (index: number) => {
    const photo = uploadedPhotos[index]
    
    try {
      await supabaseDataService.deleteProjectPhoto(photo.fileName)
      
      const newPhotos = uploadedPhotos.filter((_, i) => i !== index)
      setUploadedPhotos(newPhotos)
      
      const allUrls = newPhotos.map(p => p.url)
      onUploadComplete?.(allUrls)
      
      toast.success('Photo removed successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to remove photo')
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const getPhaseLabel = () => {
    switch (photoType) {
      case 'before': return 'Before Work'
      case 'during': return 'Work in Progress'
      case 'after': return 'Completed Work'
      default: return 'Photos'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {getPhaseLabel()} Photos
        </h3>
        <span className="text-sm text-gray-500">
          {uploadedPhotos.length}/{maxFiles} photos
        </span>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading photos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-blue-600 cursor-pointer">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Photos Grid */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={`${photoType} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePhoto(index)
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Photo info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs truncate">{photo.file.name}</p>
                <p className="text-xs text-gray-300">
                  {(photo.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedPhotos.length === 0 && (
        <div className="text-center py-8">
          <Image className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No {photoType} photos uploaded yet
          </p>
        </div>
      )}
    </div>
  )
}