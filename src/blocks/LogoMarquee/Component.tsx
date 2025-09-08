'use client'

import React, { useState } from 'react'
import type { LogoMarqueeBlock as LogoMarqueeBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Marquee } from '@/components/ui/marquee'
import RichText from '@/components/RichText'

// Individual Logo Component
const LogoItem: React.FC<{
  logo: LogoMarqueeBlockType['logos'][0]
  onHover: (isHovering: boolean) => void
}> = ({ logo, onHover }) => {
  const { logo: logoMedia, companyName, highlighted, enableLink, link } = logo

  // inside LogoItem
  const CARD_W = 224 // w-56 => 14rem
  const CONTENT_W = CARD_W - 32 // minus p-4 left+right

  // Get button link
  const getLogoLink = () => {
    if (!enableLink || !link) return null

    return link.type === 'reference' && link.reference?.value
      ? `/${link.reference.value}`
      : link.url || null
  }

  const logoElement = (
    <div
      className={`flex h-16 w-56 items-center justify-center rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] ${
        highlighted ? 'ring-2 ring-blue-500' : ''
      }`}
      onMouseEnter={() => {
        onHover(true)
      }}
      onMouseLeave={() => {
        onHover(false)
      }}
    >
      <Media
        resource={logoMedia}
        // 1) Correct responsive hint so Next serves crisp srcsets
        size={`${CONTENT_W}px`}
        // 2) Skip lazy IO in a marquee so blur doesn't linger
        loading="eager"
        // Keep the no-stretch overrides you added earlier
        pictureClassName="
    inline-grid place-items-center
    [&>span]:!w-auto [&>span]:!h-auto
    [&>span]:!max-w-full [&>span]:!max-h-12
    [&>span>span]:!w-auto [&>span>span]:!h-auto
  "
        imgClassName="!w-auto !h-auto !max-h-12 !max-w-full object-contain"
        alt={companyName || 'Company logo'}
      />
    </div>
  )

  const logoLink = getLogoLink()

  if (logoLink) {
    return (
      <a
        href={logoLink}
        target={link?.newTab ? '_blank' : '_self'}
        rel={link?.newTab ? 'noopener noreferrer' : undefined}
        className="block"
        onMouseEnter={() => {
          onHover(true)
        }}
        onMouseLeave={() => {
          onHover(false)
        }}
      >
        {logoElement}
      </a>
    )
  }

  return logoElement
}

// Marquee Row with Fade Overlays
const MarqueeRow: React.FC<{
  logos: LogoMarqueeBlockType['logos']
  reverse?: boolean
  pauseOnHover?: boolean
  duration: string
  isPaused: boolean
  onLogoHover: (isHovering: boolean) => void
}> = ({ logos, reverse = false, pauseOnHover = false, duration, isPaused, onLogoHover }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />

      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <Marquee
        className={`py-4 ${isPaused ? '[&_.animate-marquee]:[animation-play-state:paused!important]' : ''}`}
        pauseOnHover={false}
        reverse={reverse}
        style={
          {
            '--duration': duration,
            '--gap': '2rem',
          } as React.CSSProperties
        }
      >
        {logos.map((logo, index) => (
          <LogoItem
            key={`${reverse ? 'reverse' : 'forward'}-${index}`}
            logo={logo}
            onHover={onLogoHover}
          />
        ))}
      </Marquee>
    </div>
  )
}

// Main Component
export const LogoMarqueeBlock: React.FC<LogoMarqueeBlockType> = ({
  description,
  logos,
  marqueeSettings,
  backgroundColor = 'white',
}) => {
  const [isHovered, setIsHovered] = useState(false)

  if (!logos || logos.length === 0) {
    return null
  }

  // Get background color classes
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'lightGray':
        return 'bg-gray-50'
      case 'lightBlue':
        return 'bg-primary/10'
      case 'white':
      default:
        return 'bg-white'
    }
  }

  // Get marquee speed duration
  const getMarqueeSpeed = () => {
    switch (marqueeSettings?.speed) {
      case 'slow':
        return '60s'
      case 'fast':
        return '15s'
      case 'normal':
      default:
        return '40s'
    }
  }

  // Split logos into 3 rows
  const logosPerRow = Math.ceil(logos.length / 3)
  const row1 = logos.slice(0, logosPerRow)
  const row2 = logos.slice(logosPerRow, logosPerRow * 2)
  const row3 = logos.slice(logosPerRow * 2)

  const marqueeDuration = getMarqueeSpeed()
  const pauseOnHover = marqueeSettings?.pauseOnHover ?? false
  const reverse = marqueeSettings?.reverse ?? false

  // Handle hover for all logos
  const handleLogoHover = (isHovering: boolean) => {
    setIsHovered(isHovering)
  }

  return (
    <section className={`pb-8 md:pb-12 ${getBackgroundClasses()}`}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-2">
            <div className=" text-black">
              <RichText
                data={description}
                className="text-black md:text-2xl text-lg font-normal md:!leading-[1.6] !leading-[1.4] !mx-0"
              />
            </div>
          </div>

          {/* Right Side - Logo Marquee */}
          <div className="lg:col-span-3 space-y-2">
            {/* Row 1 */}
            <MarqueeRow
              logos={row1}
              reverse={reverse}
              pauseOnHover={pauseOnHover}
              duration={marqueeDuration}
              isPaused={isHovered}
              onLogoHover={handleLogoHover}
            />

            {/* Row 2 */}
            <MarqueeRow
              logos={row2}
              reverse={!reverse} // Opposite direction for visual interest
              pauseOnHover={pauseOnHover}
              duration={marqueeDuration}
              isPaused={isHovered}
              onLogoHover={handleLogoHover}
            />

            {/* Row 3 */}
            <MarqueeRow
              logos={row3}
              reverse={reverse}
              pauseOnHover={pauseOnHover}
              duration={marqueeDuration}
              isPaused={isHovered}
              onLogoHover={handleLogoHover}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
