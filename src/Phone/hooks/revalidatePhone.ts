import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidatePhone: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating Phone`)

    revalidateTag('global_phone')
    revalidateTag('global_header')
    revalidateTag('global_footer')
  }

  return doc
}
