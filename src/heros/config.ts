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
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
