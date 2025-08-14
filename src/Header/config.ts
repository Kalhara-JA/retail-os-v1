import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'link',
          type: 'group',
          label: 'Navigation Link',
          fields: [
            {
              name: 'type',
              type: 'radio',
              admin: {
                layout: 'horizontal',
                width: '50%',
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
              name: 'newTab',
              type: 'checkbox',
              admin: {
                style: {
                  alignSelf: 'flex-end',
                },
                width: '50%',
              },
              label: 'Open in new tab',
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
              label: 'Navigation Label',
              required: true,
            },
          ],
        },
        {
          name: 'hasDropdown',
          type: 'checkbox',
          label: 'Has Dropdown Menu',
          admin: {
            description: 'Enable this to add a dropdown menu with multiple sections',
          },
        },
        {
          name: 'dropdownItems',
          type: 'array',
          label: 'Dropdown Sections',
          admin: {
            condition: (data, siblingData) => siblingData?.hasDropdown === true,
            initCollapsed: true,
            description: 'Add up to 3 sections to your dropdown menu',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              required: true,
              admin: {
                description: 'The main title for this dropdown section',
              },
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Section Icon',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Help/Support', value: 'help' },
                { label: 'Topics', value: 'topics' },
                { label: 'Tools', value: 'tools' },
                { label: 'Business', value: 'business' },
                { label: 'Marketing', value: 'marketing' },
                { label: 'Growth', value: 'growth' },
              ],
              admin: {
                description: 'Choose an icon for this section',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Section Items',
              admin: {
                description: 'Add links to this dropdown section',
              },
              fields: [
                {
                  name: 'link',
                  type: 'group',
                  label: 'Link Details',
                  fields: [
                    {
                      name: 'type',
                      type: 'radio',
                      admin: {
                        layout: 'horizontal',
                        width: '50%',
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
                      name: 'newTab',
                      type: 'checkbox',
                      admin: {
                        style: {
                          alignSelf: 'flex-end',
                        },
                        width: '50%',
                      },
                      label: 'Open in new tab',
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
                      label: 'Link Label',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Description',
                  admin: {
                    description: 'Optional sub-text description for this link',
                  },
                },
              ],
              maxRows: 8,
            },
          ],
          maxRows: 3,
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'demoButton',
      type: 'group',
      label: 'Demo Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Book a Demo',
        },
        {
          name: 'link',
          type: 'group',
          label: 'Button Link',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Custom URL', value: 'custom' },
                { label: 'Reference', value: 'reference' },
              ],
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
              relationTo: 'pages',
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
    },
    {
      name: 'showLanguageSelector',
      type: 'checkbox',
      label: 'Show Language Selector',
      defaultValue: true,
      admin: {
        description: 'Show the language selector button in the header',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
