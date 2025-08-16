'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WordRotate } from '@/components/ui/word-rotate'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  title,
  title2,
  subtitle,
  description,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white min-h-screen"
      data-theme="dark"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {media && typeof media === 'object' && (
          <Media fill videoClassName="w-full h-full object-cover" priority resource={media} />
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="container relative z-10 flex items-center justify-start">
        <Card className="bg-transparent border-none shadow-none max-w-6xl">
          <CardContent className="p-0">
            {/* Hero Content */}
            <div className="space-y-0">
              {/* Title Container - Same row on desktop, two rows on mobile */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                {/* Main Title */}
                {title && (
                  <div className="w-full lg:w-auto">
                    <h1 className="text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                      {title}
                    </h1>
                  </div>
                )}

                {/* Second Title */}
                {title2 && Array.isArray(title2) && title2.length > 0 && (
                  <div className="w-full lg:w-auto mt-0 lg:mt-0">
                    <WordRotate
                      words={title2.map((item: any) => item.phrase)}
                      duration={3000}
                      className="text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
                      motionProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 20 },
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Subtitle */}
              {subtitle && (
                <div className="w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-white leading-relaxed">
                    {subtitle}
                  </h2>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="w-full sm:w-9/12 md:w-8/12 lg:w-7/12 xl:w-6/12">
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Call to Action Buttons */}
              {Array.isArray(links) && links.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {links.map(({ link }, i) => {
                    return (
                      <div key={i} className="w-full sm:w-auto">
                        <CMSLink
                          {...link}
                          className="inline-block w-full sm:w-auto bg-primary hover:bg-primary-hover text-white rounded-full font-semibold text-lg transition-colors duration-200 text-center"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
