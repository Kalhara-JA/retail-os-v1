import React from 'react'

import type { Page } from '@/payload-types'

import { Card, CardContent } from '@/components/ui/card'

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
}) => {
  return (
    <div className="container mt-16">
      <Card className="bg-transparent border-none shadow-none max-w-[48rem]">
        <CardContent className="p-0">
          {children || (
            <div className="space-y-6">
              {/* Main Title */}
              {title && (
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
              )}

              {/* Subtitle */}
              {subtitle && (
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground leading-relaxed">
                  {subtitle}
                </h2>
              )}

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
