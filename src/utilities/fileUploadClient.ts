/**
 * Client-side file upload utilities
 */

import { validateFileSize, validateFileType, formatFileSize } from './uploadHelpers'

export interface UploadResult {
  success: boolean
  media?: any
  error?: string
  message?: string
}

export interface UploadOptions {
  file: File
  alt?: string
  caption?: string
  endpoint?: string
}

/**
 * Upload a file using the custom upload endpoint
 */
export const uploadFile = async (options: UploadOptions): Promise<UploadResult> => {
  const { file, alt, caption, endpoint = '/api/upload-media' } = options

  try {
    // Validate file before upload
    const sizeValidation = validateFileSize(file)
    if (!sizeValidation.valid) {
      return {
        success: false,
        error: 'File size validation failed',
        message: sizeValidation.message,
      }
    }

    const typeValidation = validateFileType(file)
    if (!typeValidation.valid) {
      return {
        success: false,
        error: 'File type validation failed',
        message: typeValidation.message,
      }
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    if (alt) formData.append('alt', alt)
    if (caption) formData.append('caption', caption)

    // Upload file
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed',
        message: result.message || 'An error occurred during upload',
      }
    }

    return {
      success: true,
      media: result.media,
      message: result.message || 'File uploaded successfully',
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get file size recommendations for different file types
 */
export const getFileSizeRecommendations = () => {
  return {
    images: {
      maxSize: 2 * 1024 * 1024, // 2MB
      recommended: 500 * 1024, // 500KB
      formats: ['WebP', 'JPEG', 'PNG'],
    },
    videos: {
      maxSize: 4 * 1024 * 1024, // 4MB
      recommended: 2 * 1024 * 1024, // 2MB
      formats: ['MP4', 'WebM'],
    },
    documents: {
      maxSize: 1 * 1024 * 1024, // 1MB
      recommended: 500 * 1024, // 500KB
      formats: ['PDF', 'DOC', 'DOCX'],
    },
  }
}

/**
 * Format file size recommendations for display
 */
export const getFileSizeRecommendationsText = () => {
  const recs = getFileSizeRecommendations()
  return {
    images: `Images: ${formatFileSize(recs.images.recommended)} recommended, ${formatFileSize(recs.images.maxSize)} max`,
    videos: `Videos: ${formatFileSize(recs.videos.recommended)} recommended, ${formatFileSize(recs.videos.maxSize)} max`,
    documents: `Documents: ${formatFileSize(recs.documents.recommended)} recommended, ${formatFileSize(recs.documents.maxSize)} max`,
  }
}

/**
 * Check if file is likely to cause upload issues
 */
export const checkUploadCompatibility = (
  file: File,
): {
  compatible: boolean
  warnings: string[]
  recommendations: string[]
} => {
  const warnings: string[] = []
  const recommendations: string[] = []
  const recs = getFileSizeRecommendations()

  // Check file size
  if (file.size > 4.5 * 1024 * 1024) {
    warnings.push(`File size (${formatFileSize(file.size)}) exceeds Vercel's 4.5MB limit`)
    recommendations.push('Compress the file or use a smaller version')
  }

  // Check image size
  if (file.type.startsWith('image/')) {
    if (file.size > recs.images.maxSize) {
      warnings.push(`Image size (${formatFileSize(file.size)}) is larger than recommended`)
      recommendations.push('Convert to WebP format or compress the image')
    }
  }

  // Check video size
  if (file.type.startsWith('video/')) {
    if (file.size > recs.videos.maxSize) {
      warnings.push(`Video size (${formatFileSize(file.size)}) is larger than recommended`)
      recommendations.push('Compress the video or use a lower resolution')
    }
  }

  // Check document size
  if (file.type.includes('pdf') || file.type.includes('document')) {
    if (file.size > recs.documents.maxSize) {
      warnings.push(`Document size (${formatFileSize(file.size)}) is larger than recommended`)
      recommendations.push('Compress the document or use a smaller version')
    }
  }

  return {
    compatible: warnings.length === 0,
    warnings,
    recommendations,
  }
}

/**
 * Create a user-friendly error message for upload failures
 */
export const createUploadErrorMessage = (error: string, file?: File): string => {
  if (error.includes('payload too large') || error.includes('FUNCTION_PAYLOAD_TOO_LARGE')) {
    return `File is too large for upload. Please use a file smaller than 4.5MB.${file ? ` Current file size: ${formatFileSize(file.size)}` : ''}`
  }

  if (error.includes('memory')) {
    return 'File is too large to process. Please use a smaller file or compress it.'
  }

  if (error.includes('timeout')) {
    return 'Upload timed out. Please try again with a smaller file or check your connection.'
  }

  if (error.includes('network')) {
    return 'Network error during upload. Please check your connection and try again.'
  }

  return error || 'An unexpected error occurred during upload.'
}

