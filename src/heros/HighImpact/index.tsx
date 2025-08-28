'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const subtitlePhrases = (rest as any)?.subtitlePhrases as
    | { phrase?: string; line1?: string; line2?: string }[]
    | undefined

  const splitPhraseIntoTwoLines = (phrase: string) => {
    const words = String(phrase ?? '')
      .trim()
      .split(/\s+/)
    if (words.length <= 1) return String(phrase ?? '')
    const mid = Math.floor(words.length / 2)
    const first = words.slice(0, mid).join(' ')
    const second = words.slice(mid).join(' ')
    return `${first}\n${second}`
  }

  // Determine which background to use
  const mediaObj = media as any
  const backgroundMedia: any =
    mediaObj && typeof mediaObj === 'object' && mediaObj.desktop
      ? isMobile && mediaObj.mobile
        ? mediaObj.mobile
        : mediaObj.desktop
      : media

  return (
    <div className="relative -mt-[10.4rem] flex text-white min-h-[100dvh]" data-theme="dark">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundMedia && typeof backgroundMedia === 'object' && (
          <Media
            fill
            videoClassName="absolute inset-0 w-full h-full object-cover"
            imgClassName="object-cover object-center"
            pictureClassName="w-full h-full"
            priority
            controls={false}
            resource={backgroundMedia}
          />
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            {/* Hero Content */}
            <div className="space-y-[20px] lg:space-y-[34px]">
              {/* Title Container */}
              {title && (
                <div className="w-full lg:w-auto">
                  <h1 className="font-['Roboto'] text-[58px] leading-[63px] md:text-[72px] lg:text-[88px] xl:text-[100px] 2xl:text-[110px] 2xl:leading-[0.8] font-normal text-white capitalize">
                    {title?.split(' ').map((word: string, index: number) => (
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
                <div className="w-full min-h-[130px] md:min-h-0">
                  {subtitlePhrases && subtitlePhrases.length > 0 ? (
                    <WordRotate
                      words={subtitlePhrases.map((item) => {
                        const l1 = (item.line1 || '').trim()
                        const l2 = (item.line2 || '').trim()
                        if (l1 || l2) return `${l1}\n${l2}`.trim()
                        return splitPhraseIntoTwoLines(item.phrase || '')
                      })}
                      duration={5000}
                      className="whitespace-pre-line font-['Roboto'] text-[28px] md:text-[40px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] leading-[34px] lg:leading-[84px] font-normal text-white capitalize"
                      motionProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 20 },
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                    />
                  ) : (
                    <h2 className="font-['Roboto'] text-[28px] md:text-[40px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] leading-[34px] lg:leading-[84px] font-normal text-white capitalize">
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
