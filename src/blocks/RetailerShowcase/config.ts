import type { Block, Field, GroupField } from 'payload'

// Simple link field to avoid long database identifiers
const simpleLink: GroupField = {
  name: 'link',
  type: 'group',
  admin: {
    hideGutter: true,
  },
  fields: [
    {
      name: 'type',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'reference',
      options: [
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      required: true,
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
    },
  ],
}

const retailerCardFields: Field[] = [
  {
    name: 'logo',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description: 'Small logo for the retailer',
    },
  },
  {
    name: 'coverImage',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description: 'Cover image for the card',
    },
  },
  {
    name: 'title',
    type: 'text',
    required: true,
    admin: {
      description: 'Retailer name/title',
    },
  },
  {
    name: 'subtitle',
    type: 'text',
    admin: {
      description: 'Optional subtitle or tagline',
    },
  },
  {
    name: 'points',
    type: 'richText',
    admin: {
      description: 'List of services or features (use bullet points)',
    },
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: 'Enable link',
    defaultValue: false,
  },
  {
    ...simpleLink,
    admin: {
      condition: (_, siblingData) => siblingData?.enableLink === true,
    },
  },
]

export const RetailerShowcase: Block = {
  slug: 'retailerShowcase',
  interfaceName: 'RetailerShowcaseBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main title for the showcase section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
      },
    },
    {
      name: 'retailers',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: retailerCardFields,
      admin: {
        description: 'Add retailer cards to showcase',
      },
    },
  ],
}
