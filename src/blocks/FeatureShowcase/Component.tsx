'use client'

import React from 'react'
import type { FeatureShowcaseBlock as FeatureShowcaseBlockType } from '@/payload-types'
import { Media } from '@/components/Media'

// Individual Feature Card
const FeatureCard: React.FC<{ card: FeatureShowcaseBlockType['cards'][0] }> = ({ card }) => {
  const { icon, title, description, backgroundColor, button } = card

  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'teal':
        return 'bg-teal-600'
      case 'mustard':
        return 'bg-yellow-600'
      case 'darkGray':
        return 'bg-gray-800'
      case 'blue':
        return 'bg-primary'
      case 'green':
        return 'bg-green-600'
      case 'purple':
        return 'bg-purple-600'
      case 'orange':
        return 'bg-orange-600'
      case 'red':
        return 'bg-red-600'
      default:
        return 'bg-teal-600'
    }
  }

  const getButtonLink = () => {
    if (!button?.link) return '#'
    const { link } = button
    return link.type === 'reference' && link.reference?.value
      ? `/${link.reference.value}`
      : link.url || '#'
  }

  return (
    <div
      className={`flex h-full min-h-[420px] md:min-h-[480px] flex-col p-8 text-white ${getBackgroundClasses()}`}
    >
      {/* Icon */}
      <div className="mb-6">
        <Media resource={icon} imgClassName="h-12 w-12 object-contain filter brightness-0 invert" />
      </div>

      {/* Title */}
      <h3 className="mb-4 text-xl font-bold leading-tight">{title}</h3>

      {/* Description */}
      <p className="mb-6 flex-grow leading-relaxed text-white/90">{description}</p>

      {/* Action */}
      {button && (
        <div className="mt-auto">
          <a
            href={getButtonLink()}
            target={button.link?.newTab ? '_blank' : '_self'}
            rel={button.link?.newTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center font-medium text-white hover:underline"
          >
            {button.text}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

// Main
export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockType> = ({
  title,
  description,
  cards,
  layout = 'threeColumn',
}) => {
  if (!cards || cards.length === 0) return null

  // grid layout (desktop = 3+), no gaps
  const getLayoutClasses = () => {
    switch (layout) {
      case 'twoColumn':
        return 'grid grid-cols-1 sm:grid-cols-2 gap-4'
      case 'singleColumn':
        return 'grid grid-cols-1 gap-0 max-w-2xl mx-auto'
      case 'threeColumn':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
    }
  }

  return (
    // removed section background; no extra vertical padding
    <section className="py-0">
      {/* Optional header (kept centered). Remove if you want *zero* space above cards */}
      {(title || description) && (
        <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
          {title && (
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          {description && <p className="mx-auto max-w-3xl text-lg text-gray-600">{description}</p>}
        </div>
      )}

      {/* FULL-BLEED CARDS (no left/right or top/bottom gaps) */}
      <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]">
        <div className={getLayoutClasses()}>
          {cards.map((card, i) => (
            <FeatureCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
