import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { CMSLink } from '../../components/Link'
import { MoveRight } from 'lucide-react'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    variant = 'default',
    overlayTitle,
    enableOverlayLink,
    overlayLink,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]',
          {
            container: enableGutter,
          },
          className,
        )}
      >
        {(media || staticImage) && (
          <div className="absolute inset-0">
            <Media
              imgClassName="w-full h-full object-cover"
              videoClassName="absolute inset-0 w-full h-full object-cover"
              resource={media}
              src={staticImage}
              fill
            />
          </div>
        )}

        {/* Overlay Content */}
        <div className="relative z-10 flex items-center justify-start h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-left text-white max-w-4xl">
            {overlayTitle && (
              <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light md:font-normal !leading-[1.2] mb-8">
                {overlayTitle}
              </h2>
            )}
            {enableOverlayLink && overlayLink && (
              <div className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                <CMSLink {...overlayLink} className="text-white hover:text-gray-200 underline" />
                <MoveRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
