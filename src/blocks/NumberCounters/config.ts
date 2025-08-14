import type { Block, Field } from 'payload'

const counterFields: Field[] = [
  {
    name: 'valueType',
    type: 'select',
    required: true,
    defaultValue: 'single',
    options: [
      {
        label: 'Single Number',
        value: 'single',
      },
      {
        label: 'Range',
        value: 'range',
      },
      {
        label: 'Percentage',
        value: 'percentage',
      },
      {
        label: 'Percentage Range',
        value: 'percentageRange',
      },
    ],
    admin: {
      description: 'Type of value to display',
    },
  },
  {
    name: 'singleValue',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'single',
      description: 'Single number value',
    },
  },
  {
    name: 'rangeStart',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'range',
      description: 'Start of range',
    },
  },
  {
    name: 'rangeEnd',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'range',
      description: 'End of range',
    },
  },
  {
    name: 'percentageValue',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'percentage',
      description: 'Percentage value (e.g., 50 for 50%)',
    },
  },
  {
    name: 'percentageRangeStart',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'percentageRange',
      description: 'Start of percentage range (e.g., 25 for 25%)',
    },
  },
  {
    name: 'percentageRangeEnd',
    type: 'number',
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'percentageRange',
      description: 'End of percentage range (e.g., 40 for 40%)',
    },
  },
  {
    name: 'isPercentage',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      condition: (_, siblingData) =>
        siblingData?.valueType === 'single' || siblingData?.valueType === 'range',
      description: 'Add % symbol to the number(s)',
    },
  },
  {
    name: 'label',
    type: 'text',
    required: true,
    admin: {
      description: 'Description text below the number',
    },
  },
  {
    name: 'animationStartValue',
    type: 'number',
    defaultValue: 0,
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'single',
      description: 'Starting value for animation (default: 0)',
    },
  },
  {
    name: 'direction',
    type: 'select',
    defaultValue: 'up',
    options: [
      {
        label: 'Count Up',
        value: 'up',
      },
      {
        label: 'Count Down',
        value: 'down',
      },
    ],
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'single',
      description: 'Animation direction',
    },
  },
  {
    name: 'delay',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 5,
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'single',
      description: 'Delay before animation starts (seconds)',
    },
  },
  {
    name: 'decimalPlaces',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 4,
    admin: {
      condition: (_, siblingData) => siblingData?.valueType === 'single',
      description: 'Number of decimal places to show',
    },
  },
]

export const NumberCounters: Block = {
  slug: 'numberCounters',
  interfaceName: 'NumberCountersBlock',
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
        description: 'Optional description text',
      },
    },
    {
      name: 'counters',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: counterFields,
      admin: {
        description: 'Add number counters to display',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid (2x2)',
          value: 'grid',
        },
        {
          label: 'Horizontal Row',
          value: 'row',
        },
        {
          label: 'Single Column',
          value: 'column',
        },
      ],
      admin: {
        description: 'Layout arrangement for the counters',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'dark',
      options: [
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'Transparent',
          value: 'transparent',
        },
      ],
      admin: {
        description: 'Background color theme',
      },
    },
  ],
}
