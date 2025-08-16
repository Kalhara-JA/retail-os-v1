import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Whatsapp } from '@/payload-types'

export const getWhatsApp = async (req?: PayloadRequest): Promise<Whatsapp> => {
  const payload = await getPayload({ config })

  try {
    const whatsapp = await payload.findGlobal({
      slug: 'whatsapp',
      req,
    })

    return whatsapp as Whatsapp
  } catch (error) {
    console.error('Error fetching WhatsApp configuration:', error)
    // Return default configuration if there's an error
    return {
      enabled: true,
      phoneNumber: '+1234567890',
      message: 'Hello! I would like to know more about your services.',
      position: 'bottom-right',
      size: 'medium',
      tooltipText: 'Chat with us on WhatsApp',
    } as Whatsapp
  }
}
