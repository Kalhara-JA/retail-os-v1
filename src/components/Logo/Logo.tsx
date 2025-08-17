import clsx from 'clsx'
import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface LogoConfig {
  type?: ('symbol' | 'symbolWithText' | 'customImage') | null
  customImage?: (number | null) | MediaType
  companyName?: string | null
  logoColor?: ('default' | 'white' | 'black' | 'primary') | null
  textColor?: ('white' | 'black' | 'primary') | null
}

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logoConfig?: LogoConfig
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, logoConfig } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Default values if no config is provided
  const type = logoConfig?.type || 'symbolWithText'
  const companyName = logoConfig?.companyName || 'RetailOs'
  const logoColor = logoConfig?.logoColor || 'default'
  const textColor = logoConfig?.textColor || 'white'

  // Color classes for logo symbol
  const getLogoColors = () => {
    switch (logoColor) {
      case 'white':
        return {
          red: 'bg-white',
          yellow: 'bg-white',
          blue: 'bg-white',
        }
      case 'black':
        return {
          red: 'bg-black',
          yellow: 'bg-black',
          blue: 'bg-black',
        }
      case 'primary':
        return {
          red: 'bg-primary',
          yellow: 'bg-primary',
          blue: 'bg-primary',
        }
      default:
        return {
          red: 'bg-red-500',
          yellow: 'bg-yellow-400',
          blue: 'bg-primary',
        }
    }
  }

  // Color classes for text
  const getTextColor = () => {
    switch (textColor) {
      case 'white':
        return 'text-white'
      case 'black':
        return 'text-black'
      case 'primary':
        return 'text-primary'
      default:
        return 'text-white'
    }
  }

  const colors = getLogoColors()
  const textColorClass = getTextColor()

  // Render custom image logo
  if (type === 'customImage' && logoConfig?.customImage) {
    return (
      <div className={clsx('flex items-center', className)}>
        <Media
          resource={logoConfig.customImage}
          className="w-32 h-auto object-contain"
          loading={loading}
          priority={priority === 'high'}
        />
      </div>
    )
  }

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {/* Logo Symbol - Multi-colored interlocking shapes */}
      <div className="relative w-8 h-8">
        {/* Red shape */}
        <div
          className={`absolute inset-0 ${colors.red} rounded-full transform rotate-45 scale-75`}
        ></div>
        {/* Yellow shape */}
        <div
          className={`absolute inset-0 ${colors.yellow} rounded-full transform -rotate-45 scale-75`}
        ></div>
        {/* Blue shape */}
        <div
          className={`absolute inset-0 ${colors.blue} rounded-full transform rotate-0 scale-75`}
        ></div>
      </div>

      {/* Logo Text - Only show if type is symbolWithText */}
      {type === 'symbolWithText' && (
        <span className={`text-xl font-bold ${textColorClass}`}>{companyName}</span>
      )}
    </div>
  )
}
