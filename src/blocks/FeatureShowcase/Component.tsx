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
        return 'bg-[#016285]'
      case 'mustard':
        return 'bg-secondary'
      case 'darkGray':
        return 'bg-[#3E3E3E]'
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
      className={`flex h-full min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex-col justify-center p-6 sm:p-8 lg:p-10 text-white rounded-t-3xl sm:rounded-none ${getBackgroundClasses()}`}
    >
      {/* Icon */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <Media
          resource={icon}
          imgClassName="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain filter brightness-0 invert"
        />
      </div>

      {/* Title */}
      <h3 className="mb-3 sm:mb-4 lg:mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl text-white/90">
        {description}
      </p>

      {/* Action */}
      {button && (
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <a
            href={getButtonLink()}
            target={button.link?.newTab ? '_blank' : '_self'}
            rel={button.link?.newTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center text-sm sm:text-base md:text-lg font-medium text-white hover:underline transition-colors"
          >
            {button.text}
            <svg
              className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
        return 'grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4'
      case 'singleColumn':
        return 'grid grid-cols-1 gap-0 max-w-2xl mx-auto'
      case 'threeColumn':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4'
    }
  }

  return (
    // removed section background; no extra vertical padding
    <section className="py-0 bg-white">
      {/* Optional header (kept centered). Remove if you want *zero* space above cards */}
      {(title || description) && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
          {title && (
            <h2 className="mb-3 sm:mb-4 lg:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-2xl sm:max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* FULL-BLEED CARDS (no left/right or top/bottom gaps) */}
      <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]">
        <div className={`${getLayoutClasses()} -mt-8 sm:mt-0`}>
          {cards.map((card, i) => (
            <div key={i} className={`${i > 0 ? '-mt-8 sm:mt-0' : ''}`}>
              <FeatureCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
