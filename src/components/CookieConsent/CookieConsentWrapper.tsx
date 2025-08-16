import { getCookieConsent } from '@/utilities/getCookieConsent'
import { CookieConsent } from './index'
import type { CookieConsent as CookieConsentType } from '@/payload-types'

export const CookieConsentWrapper = async () => {
  const cookieConfig = (await getCookieConsent()) as CookieConsentType

  if (!cookieConfig?.enabled) {
    return null
  }

  return (
    <CookieConsent
      enabled={cookieConfig.enabled}
      title={cookieConfig.title || undefined}
      message={cookieConfig.message || undefined}
      acceptText={cookieConfig.acceptText || undefined}
      declineText={cookieConfig.declineText || undefined}
      learnMoreText={cookieConfig.learnMoreText || undefined}
      learnMoreUrl={cookieConfig.learnMoreUrl || undefined}
      position={cookieConfig.position || 'bottom'}
      theme={cookieConfig.theme || 'light'}
    />
  )
}
