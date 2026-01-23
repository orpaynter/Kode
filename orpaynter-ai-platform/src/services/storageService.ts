import { supabase } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  fullPath: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'roof-photos';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Initialize storage bucket (call this once during app setup)
  static async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: this.ALLOWED_TYPES,
          fileSizeLimit: this.MAX_FILE_SIZE
        });

        if (error) {
          console.error('Failed to create storage bucket:', error);
          throw error;
        }

        console.log(`Storage bucket '${this.BUCKET_NAME}' created successfully`);
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
      throw error;
    }
  }

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please use JPEG, PNG, or WebP images.' };
    }

    return { valid: true };
  }

  // Generate unique file path
  static generateFilePath(userId: string, assessmentId: string, fileName: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    return `${userId}/${assessmentId}/${timestamp}-${randomId}.${fileExtension}`;
  }

  // Upload single file
  static async uploadFile(
    file: File,
    userId: string,
    assessmentId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique file path
    const filePath = this.generateFilePath(userId, assessmentId, file.name);

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, percentage: 100 });
      }

      return {
        url: urlData.publicUrl,
        path: filePath,
        fullPath: data.fullPath
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: File[],
    userId: string,
    assessmentId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          userId,
          assessmentId,
          (progress) => onProgress?.(i, progress)
        );
        results.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`File ${files[i].name}: ${errorMessage}`);
        console.error(`Failed to upload file ${files[i].name}:`, error);
      }
    }

    if (errors.length > 0 && results.length === 0) {
      throw new Error(`All uploads failed: ${errors.join(', ')}`);
    }

    if (errors.length > 0) {
      console.warn(`Some uploads failed: ${errors.join(', ')}`);
    }

    return results;
  }

  // Delete file
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  }

  // Delete multiple files
  static async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(filePaths);

      if (error) {
        console.error('Bulk delete error:', error);
        throw error;
      }

      console.log(`Files deleted successfully: ${filePaths.join(', ')}`);
    } catch (error) {
      console.error('Bulk file deletion failed:', error);
      throw error;
    }
  }

  // Get file URL
  static getFileUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  // List files for a user/assessment
  static async listFiles(userId: string, assessmentId?: string): Promise<any[]> {
    try {
      const prefix = assessmentId ? `${userId}/${assessmentId}` : userId;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(prefix, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('List files error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  // Get file metadata
  static async getFileMetadata(filePath: string): Promise<any> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          search: filePath
        });

      if (error) {
        console.error('Get metadata error:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      throw error;
    }
  }

  // Create signed URL for private access (if needed)
  static async createSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Create signed URL error:', error);
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Failed to create signed URL:', error);
      throw error;
    }
  }

  // Compress image before upload (optional utility)
  static async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export default StorageService;