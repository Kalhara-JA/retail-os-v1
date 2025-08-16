import type { GlobalConfig } from 'payload'
import { revalidateCookieConsent } from './hooks/revalidateCookieConsent'

export const CookieConsent: GlobalConfig = {
  slug: 'cookie-consent',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Cookie Consent',
      defaultValue: true,
      admin: {
        description: 'Show or hide the cookie consent banner',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Banner Title',
      defaultValue: 'We use cookies',
      admin: {
        description: 'Main title of the cookie consent banner',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Banner Message',
      defaultValue:
        'We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
      admin: {
        description: 'Main message explaining cookie usage',
      },
    },
    {
      name: 'acceptText',
      type: 'text',
      label: 'Accept Button Text',
      defaultValue: 'Accept',
      admin: {
        description: 'Text for the accept button',
      },
    },
    {
      name: 'declineText',
      type: 'text',
      label: 'Decline Button Text',
      defaultValue: 'Decline',
      admin: {
        description: 'Text for the decline button',
      },
    },
    {
      name: 'learnMoreText',
      type: 'text',
      label: 'Learn More Link Text',
      defaultValue: 'Learn more',
      admin: {
        description: 'Text for the learn more link',
      },
    },
    {
      name: 'learnMoreUrl',
      type: 'text',
      label: 'Learn More URL',
      defaultValue: '/privacy-policy',
      admin: {
        description: 'URL for the learn more link (privacy policy page)',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Banner Position',
      defaultValue: 'bottom',
      options: [
        { label: 'Bottom', value: 'bottom' },
        { label: 'Top', value: 'top' },
      ],
      admin: {
        description: 'Position of the cookie consent banner',
      },
    },
    {
      name: 'theme',
      type: 'select',
      label: 'Banner Theme',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        description: 'Visual theme of the cookie consent banner',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCookieConsent],
  },
}
