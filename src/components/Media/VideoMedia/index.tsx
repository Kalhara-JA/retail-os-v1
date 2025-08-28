'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, url, updatedAt, mimeType } = resource

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        {url ? <source src={getMediaUrl(url, updatedAt)} type={mimeType || undefined} /> : null}
        {filename ? (
          <>
            <source
              src={getMediaUrl(`/media/${filename}`, updatedAt)}
              type={mimeType || undefined}
            />
            <source
              src={getMediaUrl(`/media/file/${filename}`, updatedAt)}
              type={mimeType || undefined}
            />
          </>
        ) : null}
      </video>
    )
  }

  return null
}
