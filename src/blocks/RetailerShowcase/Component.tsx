'use client'

import React from 'react'
import type { RetailerShowcaseBlock as RetailerShowcaseBlockType } from '@/payload-types'
import { Carousel } from '@/components/ui/apple-cards-carousel'
import { Media } from '@/components/Media'

/**
 * Retailer Card – sized and styled to match the screenshot:
 * - Desktop: ~420w x ~520h
 * - Tablet: 380w x 500h
 * - Mobile: 300w x 420h
 * Cover image is a wide banner; bullets use blue markers.
 */
const RetailerCard: React.FC<{
  retailer: RetailerShowcaseBlockType['retailers'][0]
  index: number
}> = ({ retailer }) => {
  const { logo, coverImage, points, enableLink, link } = retailer

  const card = (
    <div
      className={[
        // FIXED sizes per breakpoint (all cards identical)
        'relative flex flex-col overflow-hidden rounded-3xl bg-white',
        'shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
        'h-[450px] w-[300px]', // mobile
        'md:h-[500px] md:w-[380px]', // tablet
        'xl:h-[500px] xl:w-[420px]', // desktop
      ].join(' ')}
    >
      {/* Logo (top) */}
      <div className="p-6 pb-6">
        <Media resource={logo} imgClassName="h-12 w-auto object-contain" />
      </div>

      {/* Cover image (fixed height) */}
      <div className="relative mx-6 mb-4 h-[140px] overflow-hidden rounded-xl md:h-[170px] xl:h-[190px]">
        <Media resource={coverImage} imgClassName="h-full w-full object-cover" />
      </div>

      {/* Points: occupies remaining space; scrolls if too long */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full overflow-auto pr-1">
          {points && points.length > 0 && (
            <ul className="space-y-3">
              {points.map((pointItem, index) => (
                <li key={index} className="relative pl-6 text-[15px] leading-6 text-neutral-900">
                  <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-sky-500"></div>
                  {pointItem.point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {enableLink && link && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/0 hover:ring-black/5" />
      )}
    </div>
  )

  if (enableLink && link) {
    const href =
      link.type === 'reference' && link.reference?.value
        ? `/${link.reference.value}`
        : link.url || '#'
    return (
      <a
        href={href}
        target={link.newTab ? '_blank' : '_self'}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {card}
      </a>
    )
  }

  return card
}

export const RetailerShowcaseBlock: React.FC<RetailerShowcaseBlockType> = ({
  title,
  description,
  retailers,
  backgroundImage,
}) => {
  if (!retailers?.length) return null

  const titleText = String(title ?? '')
  const hasFullStops = titleText.includes('.')
  const sentences = hasFullStops
    ? (titleText.match(/[^.]+(?:\.)?/g) || []).map((s) => s)
    : [titleText]

  const items = retailers.map((retailer, i) => (
    <RetailerCard key={i} retailer={retailer} index={i} />
  ))

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Media resource={backgroundImage} imgClassName="w-full h-full object-cover" fill />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
      )}

      {/* subtle starry/dots vibe behind (only if no background image) */}
      {!backgroundImage && (
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-16">
        {/* Header mirrors screenshot: big, bold, two-row capable */}
        <div className="mb-8 text-left sm:mb-10 md:mb-12 lg:mb-14 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12">
          <h2
            className={`text-3xl md:text-4xl lg:text-7xl font-light md:font-normal !leading-[1.2] text-white`}
          >
            {hasFullStops
              ? sentences.map((sentence, index) => (
                  <React.Fragment key={`sentence-${index}`}>
                    <span className="whitespace-nowrap">{sentence.trim()}</span>
                    {index < sentences.length - 1 ? (
                      <>
                        {' '}
                        <wbr />
                      </>
                    ) : null}
                  </React.Fragment>
                ))
              : title}
          </h2>
          {description && (
            <p className="mt-3 max-w-2xl text-sm text-neutral-300 sm:mt-4 sm:text-base md:text-lg lg:text-xl xl:max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Carousel */}
        <Carousel items={items} />
      </div>
    </section>
  )
}
