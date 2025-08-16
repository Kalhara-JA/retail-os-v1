import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Phone } from '@/payload-types'

export const getPhone = async (req?: PayloadRequest): Promise<Phone> => {
  const payload = await getPayload({ config })

  try {
    const phone = await payload.findGlobal({
      slug: 'phone',
      req,
    })

    return phone as Phone
  } catch (error) {
    console.error('Error fetching Phone configuration:', error)
    // Return default configuration if there's an error
    return {
      enabled: true,
      phoneNumber: '+1234567890',
      position: 'bottom-right',
      size: 'medium',
      tooltipText: 'Call us now',
    } as Phone
  }
}
