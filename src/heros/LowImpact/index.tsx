import React from 'react'

import type { Page } from '@/payload-types'

import { Card, CardContent } from '@/components/ui/card'
import { WordRotate } from '@/components/ui/word-rotate'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      title?: never
      subtitle?: never
      description?: never
    }
  | (Omit<Page['hero'], 'title' | 'subtitle' | 'description'> & {
      children?: never
      title?: string | null
      subtitle?: string | null
      description?: string | null
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  children,
  title,
  subtitle,
  description,
  ...rest
}) => {
  const subtitlePhrases = (rest as any)?.subtitlePhrases as { phrase: string }[] | undefined
  return (
    <div className="container mt-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px]">
      <Card className="bg-transparent border-none shadow-none max-w-[48rem]">
        <CardContent className="p-0">
          {children || (
            <div className="space-y-8">
              {/* Main Title */}
              {title && (
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
              )}

              {/* Subtitle */}
              {(subtitlePhrases && subtitlePhrases.length > 0) || subtitle ? (
                subtitlePhrases && subtitlePhrases.length > 0 ? (
                  <WordRotate
                    words={subtitlePhrases.map((item) => item.phrase)}
                    duration={3000}
                    className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground !leading-[2.5]"
                    motionProps={{
                      initial: { opacity: 0, y: -20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 20 },
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                  />
                ) : (
                  <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground !leading-[2.5]">
                    {subtitle}
                  </h2>
                )
              ) : null}

              {/* Description */}
              {description && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
