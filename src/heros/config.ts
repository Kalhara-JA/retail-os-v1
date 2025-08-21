import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      admin: {
        description: 'The main heading of the hero section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle (optional fallback)',
      admin: {
        description: 'Fallback subtitle text. Use "Subtitle Phrases" below for rotating phrases.',
      },
    },
    {
      name: 'subtitlePhrases',
      type: 'array',
      label: 'Subtitle Phrases (rotating)',
      admin: {
        description: 'Add multiple phrases for the rotating subtitle (minimum 3 recommended)',
      },
      fields: [
        {
          name: 'phrase',
          type: 'text',
          required: true,
          admin: {
            description: 'A phrase for the rotating subtitle',
          },
        },
      ],
      minRows: 3,
      maxRows: 10,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'A brief description or supporting text',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'group',
      label: 'Background Media',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description: 'Configure background media for different device types',
      },
      fields: [
        {
          name: 'desktop',
          type: 'upload',
          label: 'Desktop Background',
          relationTo: 'media',
          required: true,
          admin: {
            description:
              'Background image/video for desktop devices (recommended: 1920x1080 or larger)',
          },
        },
        {
          name: 'mobile',
          type: 'upload',
          label: 'Mobile Background (optional)',
          relationTo: 'media',
          admin: {
            description:
              'Background image/video for mobile devices (recommended: 750x1334 or similar mobile aspect ratio). If not provided, desktop background will be used.',
          },
        },
      ],
    },
  ],
  label: false,
}
