/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitizes email address
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}
