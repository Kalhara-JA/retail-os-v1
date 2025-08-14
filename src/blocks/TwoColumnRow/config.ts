import type { Block, Field, GroupField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

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

const textContentFields: Field[] = [
  {
    name: 'headline',
    type: 'text',
    label: 'Headline (small, grey)',
  },
  {
    name: 'title',
    type: 'text',
    label: 'Title (large, bold)',
  },
  {
    name: 'bodyText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: 'Body Text',
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

const mediaContentFields: Field[] = [
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    required: true,
    label: 'Media (Image or Video)',
  },
  {
    name: 'overlayText',
    type: 'text',
    label: 'Overlay Text (optional)',
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

const columnFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    required: true,
    options: [
      {
        label: 'Text Content',
        value: 'text',
      },
      {
        label: 'Media Content',
        value: 'media',
      },
    ],
  },
  {
    name: 'text',
    type: 'group',
    fields: textContentFields,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.type === 'text'
      },
    },
  },
  {
    name: 'media',
    type: 'group',
    fields: mediaContentFields,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.type === 'media'
      },
    },
  },
]

export const TwoColumnRow: Block = {
  slug: 'twoColumnRow',
  interfaceName: 'TwoColumnRowBlock',
  fields: [
    {
      name: 'rows',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'left',
          type: 'group',
          fields: columnFields,
        },
        {
          name: 'right',
          type: 'group',
          fields: columnFields,
        },
      ],
    },
  ],
}
