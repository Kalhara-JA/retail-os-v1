import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { CookieConsent } from '@/payload-types'

export const getCookieConsent = async (req?: PayloadRequest): Promise<CookieConsent> => {
  const payload = await getPayload({ config })

  try {
    const cookieConsent = await payload.findGlobal({
      slug: 'cookie-consent',
      req,
    })

    return cookieConsent as CookieConsent
  } catch (error) {
    console.error('Error fetching Cookie Consent configuration:', error)
    // Return default configuration if there's an error
    return {
      enabled: true,
      title: 'We use cookies',
      message:
        'We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
      acceptText: 'Accept',
      declineText: 'Decline',
      learnMoreText: 'Learn more',
      learnMoreUrl: '/privacy-policy',
      position: 'bottom',
      theme: 'light',
    } as CookieConsent
  }
}
