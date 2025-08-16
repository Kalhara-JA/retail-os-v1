import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { defaultLexical } from '@/fields/defaultLexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the footer (optional)',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Stop Managing Tech.',
      admin: {
        description: 'Main headline text (first part)',
      },
    },
    {
      name: 'headlineHighlight',
      type: 'text',
      required: true,
      defaultValue: 'Start Growing',
      admin: {
        description: 'Highlighted text in blue (second part of headline)',
      },
    },
    {
      name: 'headlineEnd',
      type: 'text',
      required: true,
      defaultValue: 'Your Retail Business.',
      admin: {
        description: 'Ending text of headline (after highlighted part)',
      },
    },
    {
      name: 'subheadline',
      type: 'text',
      required: true,
      defaultValue:
        "We'll Show You How RetailOs Helps You Move Faster, Simplify Operations, And Sell Smarter Starting Today",
      admin: {
        description: 'Sub-headline text below the main headline',
      },
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      defaultValue: 'Enter your email...',
      admin: {
        description: 'Placeholder text for email input field',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Book a demo >',
      admin: {
        description: 'Text for the call-to-action button',
      },
    },
    {
      name: 'contactInfo',
      type: 'text',
      defaultValue: 'Prefer To Talk Now? Call Us +972-54-586-3718',
      admin: {
        description: 'Contact information text',
      },
    },
    {
      name: 'socialMedia',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TikTok', value: 'tiktok' },
          ],
          admin: {
            description: 'Social media platform',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'URL for the social media profile',
          },
        },
      ],
      defaultValue: [
        { platform: 'youtube', url: 'https://youtube.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'tiktok', url: 'https://tiktok.com' },
      ],
      admin: {
        description: 'Social media links',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Link text',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Link URL',
          },
        },
      ],
      defaultValue: [
        { text: 'Terms of Service', url: '/terms' },
        { text: 'Privacy Policy', url: '/privacy' },
      ],
      admin: {
        description: 'Legal links in the footer',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'RetailOs. All rights reserved.',
      admin: {
        description: 'Copyright text',
      },
    },
    {
      name: 'newsletterEmailConfig',
      type: 'group',
      label: 'Newsletter Email Configuration',
      admin: {
        description: 'Configure email content for newsletter subscription form',
      },
      fields: [
        {
          name: 'welcomeEmailSubject',
          type: 'text',
          defaultValue: 'Welcome to Retail OS Newsletter!',
          admin: {
            description: 'Subject line for welcome emails sent to new subscribers',
          },
        },
        {
          name: 'welcomeEmailBody',
          type: 'richText',
          admin: {
            description:
              'Email body content for welcome emails. Use {{email}} for subscriber email, {{date}} for current date.',
          },
          editor: defaultLexical,
        },
        {
          name: 'adminNotificationSubject',
          type: 'text',
          defaultValue: 'New Newsletter Subscription',
          admin: {
            description: 'Subject line for admin notification emails',
          },
        },
        {
          name: 'adminNotificationBody',
          type: 'richText',
          admin: {
            description:
              'Email body content for admin notifications. Use {{email}} for subscriber email, {{date}} for current date.',
          },
          editor: defaultLexical,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
