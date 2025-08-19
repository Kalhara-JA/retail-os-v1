import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Overlay',
          value: 'overlay',
        },
      ],
      defaultValue: 'default',
    },
    {
      name: 'overlayTitle',
      type: 'text',
      admin: {
        condition: (data) => data.variant === 'overlay',
      },
    },
    {
      name: 'enableOverlayLink',
      type: 'checkbox',
      admin: {
        condition: (data) => data.variant === 'overlay',
      },
    },
    {
      name: 'overlayLink',
      type: 'group',
      admin: {
        condition: (data) => data.variant === 'overlay' && data.enableOverlayLink,
      },
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            {
              label: 'Custom URL',
              value: 'custom',
            },
            {
              label: 'Reference',
              value: 'reference',
            },
          ],
          defaultValue: 'custom',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'custom',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'reference',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
        },
      ],
    },
  ],
}
