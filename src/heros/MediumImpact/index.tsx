import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Card, CardContent } from '@/components/ui/card'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  title,
  subtitle,
  description,
}) => {
  return (
    <div className="">
      <div className="container mb-8">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <div className="space-y-6">
              {/* Main Title */}
              {title && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
              )}

              {/* Subtitle */}
              {subtitle && (
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground leading-relaxed">
                  {subtitle}
                </h2>
              )}

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
                        <CMSLink {...link} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container">
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
