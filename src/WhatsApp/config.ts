import type { GlobalConfig } from 'payload'
import { revalidateWhatsApp } from './hooks/revalidateWhatsApp'

export const WhatsApp: GlobalConfig = {
  slug: 'whatsapp',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable WhatsApp Button',
      defaultValue: true,
      admin: {
        description: 'Show or hide the floating WhatsApp button',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
      required: true,
      defaultValue: '+1234567890',
      admin: {
        description: 'Phone number for WhatsApp (include country code, e.g., +1234567890)',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Default Message',
      defaultValue: 'Hello! I would like to know more about your services.',
      admin: {
        description: 'Default message that will be pre-filled when users click the WhatsApp button',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Button Position',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
      ],
      admin: {
        description: 'Position of the WhatsApp button on the screen',
      },
    },
    {
      name: 'size',
      type: 'select',
      label: 'Button Size',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        description: 'Size of the WhatsApp button',
      },
    },
    {
      name: 'tooltipText',
      type: 'text',
      label: 'Tooltip Text',
      defaultValue: 'Chat with us on WhatsApp',
      admin: {
        description: 'Text shown when hovering over the WhatsApp button',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateWhatsApp],
  },
}
