'use client'

import React from 'react'
import type { LogoMarqueeBlock as LogoMarqueeBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Marquee } from '@/components/ui/marquee'
import RichText from '@/components/RichText'

// Individual Logo Component
const LogoItem: React.FC<{
  logo: LogoMarqueeBlockType['logos'][0]
}> = ({ logo }) => {
  const { logo: logoMedia, companyName, highlighted, enableLink, link } = logo

  // Get button link
  const getLogoLink = () => {
    if (!enableLink || !link) return null

    return link.type === 'reference' && link.reference?.value
      ? `/${link.reference.value}`
      : link.url || null
  }

  const logoElement = (
    <div
      className={`flex h-20 w-32 items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        highlighted ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <Media
        resource={logoMedia}
        imgClassName="h-12 w-auto max-w-full object-contain"
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
      >
        {logoElement}
      </a>
    )
  }

  return logoElement
}

// Main Component
export const LogoMarqueeBlock: React.FC<LogoMarqueeBlockType> = ({
  description,
  logos,
  marqueeSettings,
  backgroundColor = 'white',
}) => {
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
        return '20s'
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

  return (
    <section className={`py-16 md:py-20 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-lg text-black leading-relaxed">
              <RichText data={description} className="text-black" />
            </div>
          </div>

          {/* Right Side - Logo Marquee */}
          <div className="lg:col-span-3 space-y-2">
            {/* Row 1 */}
            <Marquee
              className="py-2"
              pauseOnHover={marqueeSettings?.pauseOnHover ?? false}
              reverse={marqueeSettings?.reverse ?? false}
              style={
                {
                  '--duration': getMarqueeSpeed(),
                  '--gap': '2rem',
                } as React.CSSProperties
              }
            >
              {row1.map((logo, index) => (
                <LogoItem key={`row1-${index}`} logo={logo} />
              ))}
            </Marquee>

            {/* Row 2 */}
            <Marquee
              className="py-2"
              pauseOnHover={marqueeSettings?.pauseOnHover ?? false}
              reverse={!(marqueeSettings?.reverse ?? false)} // Opposite direction for visual interest
              style={
                {
                  '--duration': getMarqueeSpeed(),
                  '--gap': '2rem',
                } as React.CSSProperties
              }
            >
              {row2.map((logo, index) => (
                <LogoItem key={`row2-${index}`} logo={logo} />
              ))}
            </Marquee>

            {/* Row 3 */}
            <Marquee
              className="py-2"
              pauseOnHover={marqueeSettings?.pauseOnHover ?? false}
              reverse={marqueeSettings?.reverse ?? false}
              style={
                {
                  '--duration': getMarqueeSpeed(),
                  '--gap': '2rem',
                } as React.CSSProperties
              }
            >
              {row3.map((logo, index) => (
                <LogoItem key={`row3-${index}`} logo={logo} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}
