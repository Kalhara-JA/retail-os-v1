import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateWhatsApp: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating WhatsApp`)

    revalidateTag('global_whatsapp')
    revalidateTag('global_header')
    revalidateTag('global_footer')
  }

  return doc
}
