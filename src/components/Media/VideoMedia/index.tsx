'use client'

import { cn } from '@/utilities/ui'
import React, { useCallback, useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const {
    onClick,
    resource,
    videoClassName,
    controls = false,
    autoPlay = true,
    muted = true,
    loop = true,
    pauseOnClick = false,
  } = props

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

  const handleClick = useCallback(() => {
    if (pauseOnClick && videoRef.current) {
      const video = videoRef.current
      if (video.paused) {
        void video.play()
      } else {
        video.pause()
      }
    }
    if (onClick) onClick()
  }, [pauseOnClick, onClick])

  if (resource && typeof resource === 'object') {
    const { filename, url, updatedAt, mimeType } = resource

    return (
      <video
        autoPlay={autoPlay && !controls}
        className={cn(videoClassName)}
        controls={controls}
        loop={loop}
        muted={muted}
        onClick={handleClick}
        preload="auto"
        playsInline
        // Ensures iOS treats video as inline, not full-screen only
        // Some mobile browsers are sensitive to attribute presence order/flags
        // so we redundantly include the string attribute as well via props
        ref={videoRef}
        onLoadedData={() => {
          if (autoPlay && !controls && videoRef.current) {
            void videoRef.current.play().catch(() => {})
          }
        }}
        onCanPlay={() => {
          if (autoPlay && !controls && videoRef.current && videoRef.current.paused) {
            void videoRef.current.play().catch(() => {})
          }
        }}
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
