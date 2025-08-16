import type { GlobalConfig } from 'payload'
import { revalidatePhone } from './hooks/revalidatePhone'

export const Phone: GlobalConfig = {
  slug: 'phone',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Phone Button',
      defaultValue: true,
      admin: {
        description: 'Show or hide the floating phone button',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
      required: true,
      defaultValue: '+1234567890',
      admin: {
        description: 'Phone number for direct calling (include country code, e.g., +1234567890)',
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
        description: 'Position of the phone button on the screen',
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
        description: 'Size of the phone button',
      },
    },
    {
      name: 'tooltipText',
      type: 'text',
      label: 'Tooltip Text',
      defaultValue: 'Call us now',
      admin: {
        description: 'Text shown when hovering over the phone button',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePhone],
  },
}
