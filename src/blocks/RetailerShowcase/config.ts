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
    required: false,
    admin: {
      description: 'Retailer name/title (optional)',
    },
  },
  {
    name: 'subtitle',
    type: 'text',
    admin: {
      description: 'Subtitle or tagline (optional)',
    },
  },
  {
    name: 'points',
    type: 'array',
    label: 'Points',
    admin: {
      description: 'Add individual points or features for this retailer',
    },
    fields: [
      {
        name: 'point',
        type: 'text',
        label: 'Point',
        required: true,
        admin: {
          description: 'Enter a single point or feature',
        },
      },
    ],
    minRows: 1,
    maxRows: 8,
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
      name: 'htmlId',
      type: 'text',
      label: 'HTML element ID',
      admin: {
        description: 'Optional id attribute for anchoring / in-page links',
      },
    },
    {
      name: 'title1',
      type: 'text',
      required: true,
      admin: {
        description: 'The first title to display',
      },
    },
    {
      name: 'title2',
      type: 'text',
      required: false,
      admin: {
        description: 'The second title to display (optional)',
      },
    },
    {
      name: 'title3',
      type: 'text',
      required: false,
      admin: {
        description: 'The third title to display (optional)',
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
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the section (optional)',
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
