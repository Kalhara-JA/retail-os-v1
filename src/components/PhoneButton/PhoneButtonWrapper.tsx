import { getPhone } from '@/utilities/getPhone'
import { PhoneButton } from './index'
import type { Phone } from '@/payload-types'

export const PhoneButtonWrapper = async () => {
  const phoneConfig = (await getPhone()) as Phone

  if (!phoneConfig?.enabled) {
    return null
  }

  return (
    <PhoneButton
      phoneNumber={phoneConfig.phoneNumber}
      enabled={phoneConfig.enabled}
      position={phoneConfig.position || 'bottom-right'}
      size={phoneConfig.size || 'medium'}
      tooltipText={phoneConfig.tooltipText || undefined}
    />
  )
}
