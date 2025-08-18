'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Card, CardContent } from '@/components/ui/card'
import { WordRotate } from '@/components/ui/word-rotate'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  title,
  subtitle,
  description,
  ...rest
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const subtitlePhrases = (rest as any)?.subtitlePhrases as { phrase: string }[] | undefined

  return (
    <div className="relative -mt-[10.4rem] flex text-white min-h-screen" data-theme="dark">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {media && typeof media === 'object' && (
          <Media fill videoClassName="w-full h-full object-cover" priority resource={media} />
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16">
        <Card className="bg-transparent border-none shadow-none max-w-6xl">
          <CardContent className="p-0">
            {/* Hero Content */}
            <div className="space-y-3 lg:space-y-1">
              {/* Title Container */}
              {title && (
                <div className="w-full lg:w-auto">
                  <h1 className="text-6xl md:text-5xl lg:text-6xl xl:text-8xl font-normal text-white leading-[1.2] md:leading-[0.9] lg:leading-[0.8]">
                    {title?.split(' ').map((word, index) => (
                      <span key={index}>
                        {word}
                        {index === 1 && <br className="md:hidden" />}
                        {index < title.split(' ').length - 1 && ' '}
                      </span>
                    ))}
                  </h1>
                </div>
              )}

              {/* Subtitle (rotating phrases preferred) */}
              {(subtitlePhrases && subtitlePhrases.length > 0) || subtitle ? (
                <div className="w-full sm:w-8/12 md:w-9/12 lg:w-8/12 xl:w-9/12">
                  {subtitlePhrases && subtitlePhrases.length > 0 ? (
                    <WordRotate
                      words={subtitlePhrases.map((item) => item.phrase)}
                      duration={3000}
                      className="text-3xl md:text-4xl lg:text-6xl xl:text-6xl font-normal text-white !leading-[1.4] "
                      motionProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 20 },
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                    />
                  ) : (
                    <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-6xl font-normal text-white !leading-[1.4]">
                      {subtitle}
                    </h2>
                  )}
                </div>
              ) : null}

              {/* Description */}
              {description && (
                <div className="w-full sm:w-9/12 md:w-8/12 lg:w-7/12 xl:w-6/12">
                  <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Call to Action Buttons */}
              {Array.isArray(links) && links.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-12">
                  {links.map(({ link }, i) => {
                    return (
                      <div key={i} className="w-full sm:w-auto">
                        <CMSLink
                          {...link}
                          className="inline-block w-full sm:w-auto bg-primary hover:bg-primary-hover text-white rounded-full font-light text-xl md:text-xl lg:text-3xl px-6 py-5 md:px-8 md:py-5 lg:px-12 lg:py-8 transition-colors duration-200 text-center flex items-center justify-center"
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
