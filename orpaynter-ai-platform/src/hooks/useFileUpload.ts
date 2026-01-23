import { useState, useCallback } from 'react';
import { StorageService, type UploadResult, type UploadProgress } from '../services/storageService';
import { useAuth } from './useAuth';

export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedFiles: UploadResult[];
}

export interface UseFileUploadOptions {
  assessmentId?: string;
  maxFiles?: number;
  compressImages?: boolean;
  maxImageWidth?: number;
  imageQuality?: number;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { user } = useAuth();
  const {
    assessmentId = 'temp',
    maxFiles = 10,
    compressImages = true,
    maxImageWidth = 1920,
    imageQuality = 0.8,
    onUploadComplete,
    onUploadError,
    onProgress
  } = options;

  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedFiles: []
  });

  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedFiles: []
    });
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    if (!user?.id) {
      const error = 'User not authenticated';
      setState(prev => ({ ...prev, error }));
      onUploadError?.(error);
      return;
    }

    if (files.length === 0) {
      const error = 'No files selected';
      setState(prev => ({ ...prev, error }));
      onUploadError?.(error);
      return;
    }

    if (files.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed`;
      setState(prev => ({ ...prev, error }));
      onUploadError?.(error);
      return;
    }

    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
      uploadedFiles: []
    }));

    try {
      let processedFiles = [...files];

      // Compress images if enabled
      if (compressImages) {
        const compressionPromises = files.map(async (file) => {
          if (file.type.startsWith('image/')) {
            try {
              return await StorageService.compressImage(file, maxImageWidth, imageQuality);
            } catch (error) {
              console.warn(`Failed to compress ${file.name}, using original:`, error);
              return file;
            }
          }
          return file;
        });

        processedFiles = await Promise.all(compressionPromises);
      }

      // Upload files with progress tracking
      const results = await StorageService.uploadMultipleFiles(
        processedFiles,
        user.id,
        assessmentId,
        (fileIndex, fileProgress) => {
          const overallProgress = ((fileIndex + fileProgress.percentage / 100) / files.length) * 100;
          setState(prev => ({ ...prev, progress: overallProgress }));
          onProgress?.(overallProgress);
        }
      );

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFiles: results
      }));

      onUploadComplete?.(results);
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage
      }));
      onUploadError?.(errorMessage);
      throw error;
    }
  }, [user?.id, assessmentId, maxFiles, compressImages, maxImageWidth, imageQuality, onUploadComplete, onUploadError, onProgress]);

  const uploadSingleFile = useCallback(async (file: File) => {
    const results = await uploadFiles([file]);
    return results?.[0] || null;
  }, [uploadFiles]);

  const deleteFile = useCallback(async (filePath: string) => {
    try {
      await StorageService.deleteFile(filePath);
      setState(prev => ({
        ...prev,
        uploadedFiles: prev.uploadedFiles.filter(file => file.path !== filePath)
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const validateFiles = useCallback((files: File[]): { valid: File[]; invalid: { file: File; error: string }[] } => {
    const valid: File[] = [];
    const invalid: { file: File; error: string }[] = [];

    files.forEach(file => {
      const validation = StorageService.validateFile(file);
      if (validation.valid) {
        valid.push(file);
      } else {
        invalid.push({ file, error: validation.error || 'Invalid file' });
      }
    });

    return { valid, invalid };
  }, []);

  return {
    ...state,
    uploadFiles,
    uploadSingleFile,
    deleteFile,
    validateFiles,
    resetState,
    canUpload: !state.isUploading && !!user?.id
  };
}

// Hook for drag and drop functionality
export function useDragAndDrop(onFilesDropped: (files: File[]) => void) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesDropped(files);
    }
  }, [onFilesDropped]);

  return {
    isDragOver,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  };
}

export default useFileUpload;