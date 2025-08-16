import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateCookieConsent: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating Cookie Consent`)

    revalidateTag('global_cookie-consent')
    revalidateTag('global_header')
    revalidateTag('global_footer')
  }

  return doc
}
