import type { Block, Field } from 'payload'

export const TitleBlock: Block = {
  slug: 'titleBlock',
  interfaceName: 'TitleBlock',
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
  ],
}
