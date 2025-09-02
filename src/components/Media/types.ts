import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
  /** whether to show native video controls (default: true) */
  controls?: boolean
  /** whether the video should auto play (default: true) */
  autoPlay?: boolean
  /** whether the video should be muted (default: true for autoplay compatibility) */
  muted?: boolean
  /** whether the video should loop (default: true) */
  loop?: boolean
  /** pause or toggle play/pause when clicking on the video (default: false) */
  pauseOnClick?: boolean
}
