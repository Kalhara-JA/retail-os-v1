import type { Block, Field, GroupField } from 'payload'

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

const cardFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
    label: 'Card Title',
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Card Description',
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    required: true,
    label: 'Card Image',
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: 'Enable Call to Action',
  },
  {
    ...simpleLink,
    admin: {
      ...simpleLink.admin,
      condition: (_data: any, siblingData: any) => {
        return Boolean(siblingData?.enableLink)
      },
    },
  },
]

export const HorizontalScrollCards: Block = {
  slug: 'horizontalScrollCards',
  interfaceName: 'HorizontalScrollCardsBlock',
  labels: {
    singular: 'Horizontal Scroll Card',
    plural: 'Horizontal Scroll Cards',
  },
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
      name: 'title',
      type: 'text',
      label: 'Title',
      admin: {
        description: 'Optional title displayed above the carousel',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 10,
      admin: {
        initCollapsed: true,
      },
      fields: cardFields,
    },
    {
      name: 'cardHeight',
      type: 'select',
      defaultValue: '450',
      options: [
        {
          label: 'Small (350px)',
          value: '350',
        },
        {
          label: 'Medium (450px)',
          value: '450',
        },
        {
          label: 'Large (550px)',
          value: '550',
        },
      ],
      label: 'Card Height',
    },
  ],
}
