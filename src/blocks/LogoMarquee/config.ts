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

const logoFields: Field[] = [
  {
    name: 'logo',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description: 'Company logo (SVG or PNG recommended)',
    },
  },
  {
    name: 'companyName',
    type: 'text',
    admin: {
      description: 'Company name for accessibility (optional)',
    },
  },
  {
    name: 'highlighted',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: 'Highlight this logo with a border',
    },
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: 'Make logo clickable',
    },
  },
  {
    ...simpleLink,
    admin: {
      condition: (_, siblingData) => siblingData?.enableLink === true,
      description: 'Logo link (optional)',
    },
  },
]

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  fields: [
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Description text explaining the integration capabilities',
      },
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 6,
      maxRows: 30,
      fields: logoFields,
      admin: {
        description:
          'Add company logos for the marquee (minimum 6, will be distributed across 3 rows)',
      },
    },
    {
      name: 'marqueeSettings',
      type: 'group',
      fields: [
        {
          name: 'speed',
          type: 'select',
          defaultValue: 'normal',
          options: [
            {
              label: 'Slow',
              value: 'slow',
            },
            {
              label: 'Normal',
              value: 'normal',
            },
            {
              label: 'Fast',
              value: 'fast',
            },
          ],
          admin: {
            description: 'Marquee animation speed',
          },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Pause animation when hovering over logos',
          },
        },
        {
          name: 'reverse',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Reverse animation direction',
          },
        },
      ],
      admin: {
        description: 'Marquee animation settings',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Light Gray',
          value: 'lightGray',
        },
        {
          label: 'Light Blue',
          value: 'lightBlue',
        },
      ],
      admin: {
        description: 'Background color for the section',
      },
    },
  ],
}
