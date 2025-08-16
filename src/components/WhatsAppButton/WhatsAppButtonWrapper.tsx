import { getWhatsApp } from '@/utilities/getWhatsApp'
import { WhatsAppButton } from './index'
import type { Whatsapp } from '@/payload-types'

export const WhatsAppButtonWrapper = async () => {
  const whatsappConfig = (await getWhatsApp()) as Whatsapp

  if (!whatsappConfig?.enabled) {
    return null
  }

  return (
    <WhatsAppButton
      phoneNumber={whatsappConfig.phoneNumber}
      message={whatsappConfig.message || undefined}
      enabled={whatsappConfig.enabled}
      position={whatsappConfig.position || 'bottom-right'}
      size={whatsappConfig.size || 'medium'}
      tooltipText={whatsappConfig.tooltipText || undefined}
    />
  )
}
