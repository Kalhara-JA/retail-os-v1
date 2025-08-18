import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Card, CardContent } from '@/components/ui/card'
import { WordRotate } from '@/components/ui/word-rotate'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  title,
  subtitle,
  description,
  ...rest
}) => {
  const subtitlePhrases = (rest as any)?.subtitlePhrases as { phrase: string }[] | undefined
  return (
    <div className="">
      <div className="container mb-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px]">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <div className="space-y-8">
              {/* Main Title */}
              {title && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
              )}

              {/* Subtitle */}
              {(subtitlePhrases && subtitlePhrases.length > 0) || subtitle ? (
                subtitlePhrases && subtitlePhrases.length > 0 ? (
                  <WordRotate
                    words={subtitlePhrases.map((item) => item.phrase)}
                    duration={3000}
                    className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground !leading-[2.5]"
                    motionProps={{
                      initial: { opacity: 0, y: -20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 20 },
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                  />
                ) : (
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground !leading-[2.5]">
                    {subtitle}
                  </h2>
                )
              ) : null}

              {/* Description */}
              {description && (
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              {/* Call to Action Buttons */}
              {Array.isArray(links) && links.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {links.map(({ link }, i) => {
                    return (
                      <div key={i}>
                        <CMSLink
                          {...link}
                          className="inline-block bg-primary hover:bg-primary-hover text-white rounded-full font-normal text-base md:text-lg lg:text-3xl px-6 py-3 md:px-10 md:py-5 lg:px-16 lg:py-8 transition-colors duration-200 text-center flex items-center justify-center"
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

      <div className="container px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px]">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
