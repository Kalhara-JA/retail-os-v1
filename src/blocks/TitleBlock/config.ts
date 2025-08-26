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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title to display',
      },
    },
  ],
}
