/**
 * File upload helper utilities
 */

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes
export const RECOMMENDED_IMAGE_SIZE = 500 * 1024 // 500KB in bytes

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
  ...SUPPORTED_DOCUMENT_TYPES,
]

/**
 * Validate file size
 */
export const validateFileSize = (file: File): { valid: boolean; message?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`,
    }
  }

  if (file.size > RECOMMENDED_IMAGE_SIZE && SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: true,
      message: `Warning: Image size (${formatFileSize(file.size)}) is larger than recommended ${formatFileSize(RECOMMENDED_IMAGE_SIZE)}. Consider optimizing the image for better performance.`,
    }
  }

  return { valid: true }
}

/**
 * Validate file type
 */
export const validateFileType = (file: File): { valid: boolean; message?: string } => {
  if (!ALL_SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `File type "${file.type}" is not supported. Supported types: ${ALL_SUPPORTED_TYPES.join(', ')}`,
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get upload error message for common issues
 */
export const getUploadErrorMessage = (error: Error | { message?: string }): string => {
  if (error.message?.includes('content too large')) {
    return 'File size is too large. Please try a smaller file or contact support if you need to upload larger files.'
  }

  if (error.message?.includes('network')) {
    return 'Network error during upload. Please check your connection and try again.'
  }

  if (error.message?.includes('timeout')) {
    return 'Upload timed out. Please try again or use a smaller file.'
  }

  return error.message || 'An unexpected error occurred during upload. Please try again.'
}

/**
 * Check if running in production environment
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

/**
 * Get upload configuration based on environment
 */
export const getUploadConfig = () => {
  return {
    maxFileSize: MAX_FILE_SIZE,
    supportedTypes: ALL_SUPPORTED_TYPES,
    isProduction: isProduction(),
    useVercelBlob: isProduction() && !!process.env.BLOB_READ_WRITE_TOKEN,
  }
}
