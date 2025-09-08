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

/**
 * Parses a recipient input (string or array) into a clean list of valid emails
 */
export const parseRecipientList = (recipients: string | string[] | undefined | null): string[] => {
  if (!recipients) return []

  const rawList = Array.isArray(recipients) ? recipients : recipients.split(/[,;]/)

  const seen = new Set<string>()
  const result: string[] = []

  for (const item of rawList) {
    const cleaned = sanitizeEmail(item)
    if (cleaned && isValidEmail(cleaned) && !seen.has(cleaned)) {
      seen.add(cleaned)
      result.push(cleaned)
    }
  }

  return result
}
