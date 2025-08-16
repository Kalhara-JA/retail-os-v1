import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    title: 'RetailOs',
    description:
      'Visit the admin dashboard to make your account and seed content for your website.',
  },
  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'RetailOs',
  },
  title: 'Home',
  layout: [],
}
