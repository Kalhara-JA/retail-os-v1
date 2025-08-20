import type { Block, Field } from 'payload'

// Simple link field to avoid database identifier length issues
const simpleLink: Field = {
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

const featureCardFields: Field[] = [
  {
    name: 'icon',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description: 'Icon for the feature card (SVG recommended)',
    },
  },
  {
    name: 'title',
    type: 'text',
    required: true,
    admin: {
      description: 'Feature title',
    },
  },
  {
    name: 'description',
    type: 'textarea',
    required: true,
    admin: {
      description: 'Feature description',
    },
  },
  {
    name: 'backgroundColor',
    type: 'select',
    defaultValue: 'teal',
    options: [
      {
        label: 'Teal Blue',
        value: 'teal',
      },
      {
        label: 'Mustard Yellow',
        value: 'mustard',
      },
      {
        label: 'Dark Gray',
        value: 'darkGray',
      },
      {
        label: 'Blue',
        value: 'blue',
      },
      {
        label: 'Green',
        value: 'green',
      },
      {
        label: 'Purple',
        value: 'purple',
      },
      {
        label: 'Orange',
        value: 'orange',
      },
      {
        label: 'Red',
        value: 'red',
      },
    ],
    admin: {
      description: 'Background color for the card (shown when not hovering)',
    },
  },
  {
    name: 'backgroundVideo',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Background video to show on hover (optional)',
    },
  },
  {
    name: 'button',
    type: 'group',
    fields: [
      {
        name: 'text',
        type: 'text',
        defaultValue: 'Book a demo',
        required: true,
        admin: {
          description: 'Button text',
        },
      },
      {
        ...simpleLink,
        admin: {
          description: 'Button link',
        },
      },
    ],
    admin: {
      description: 'Action button configuration',
    },
  },
]

export const FeatureShowcase: Block = {
  slug: 'featureShowcase',
  interfaceName: 'FeatureShowcaseBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional section title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 9, // Maximum 3 rows of 3 cards each
      fields: featureCardFields,
      admin: {
        description: 'Add feature cards (max 3 per row)',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'threeColumn',
      options: [
        {
          label: 'Three Column (Desktop)',
          value: 'threeColumn',
        },
        {
          label: 'Two Column (Desktop)',
          value: 'twoColumn',
        },
        {
          label: 'Single Column',
          value: 'singleColumn',
        },
      ],
      admin: {
        description: 'Layout arrangement for the cards',
      },
    },
  ],
}
