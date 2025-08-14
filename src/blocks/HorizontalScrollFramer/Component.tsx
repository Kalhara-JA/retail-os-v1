'use client'

import * as React from 'react'
import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'

import type { HorizontalScrollCardsBlock as HorizontalScrollScrollCardsBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

type CardData = {
  title: string
  description?: string
  image: any
  enableLink?: boolean
  link?: any
}

const useViewportWidth = () => {
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vw
}

const Card: React.FC<{
  card: CardData
  width: number
  height: number
  clipPath: any // MotionValue<string>
  imageScale?: any // MotionValue<number>
}> = ({ card, width, height, clipPath, imageScale }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white" style={{ width, height }}>
      {/* Static full-size image; visibility controlled by clip-path (trim from BOTTOM) */}
      <motion.div
        className="absolute inset-0 will-change-[clip-path,transform]"
        style={{
          clipPath,
          scale: imageScale || 1,
          transformOrigin: 'center center',
        }}
      >
        <Media
          resource={card.image}
          imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      {/* Bottom content area with solid background so image never shows beneath */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pointer-events-none">
        <div className="p-6 rounded-xl bg-white pointer-events-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-gray-700 text-sm md:text-base mb-4">{card.description}</p>
          )}
          {card.enableLink && card.link && (
            <div className="mt-4">
              <CMSLink {...card.link} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const HorizontalScrollCarousel: React.FC<{
  cards: CardData[]
  width: number
  height: number
  gap?: number
  minReveal?: number // 0..1 (visible fraction when off-center) -> set to 0.5 as requested
  maxReveal?: number // 0..1 (visible fraction when centered)
  focusRadius?: number
}> = ({
  cards,
  width,
  height,
  gap = 20,
  minReveal = 0.5, // ← always show half when not centered
  maxReveal = 1.0, // ← show full image when centered
  focusRadius = 0.6,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const vw = useViewportWidth()

  // Fixed heights for the section + viewport window
  const sectionHeightPx = 1400
  const viewportHeightPx = 600

  // Layout
  const sidePad = Math.max(0, (vw - width) / 2)
  const trackWidth = cards.length * width + (cards.length - 1) * gap + sidePad * 2
  const travel = Math.max(0, trackWidth - vw)
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

  // Map window scroll to local progress anchors
  const getAnchors = useCallback(() => {
    const node = targetRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const topAbs = window.scrollY + rect.top
    const start = topAbs - window.innerHeight
    const end = topAbs + sectionHeightPx
    const length = Math.max(1, end - start)
    return { start, end, length }
  }, [sectionHeightPx])

  // Track which card is closest to center
  const [currentIndex, setCurrentIndex] = useState(0)
  const computeIndexFromScroll = useCallback(() => {
    const a = getAnchors()
    if (!a) return 0
    const p = Math.min(1, Math.max(0, (window.scrollY - a.start) / a.length))
    const currX = -travel * p
    const viewportCenter = vw / 2
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < cards.length; i++) {
      const cardCenter = sidePad + i * (width + gap) + width / 2 + currX
      const d = Math.abs(cardCenter - viewportCenter)
      if (d < best) {
        best = d
        nearest = i
      }
    }
    return nearest
  }, [cards.length, gap, sidePad, travel, vw, width, getAnchors])

  useEffect(() => {
    const handler = () => setCurrentIndex(computeIndexFromScroll())
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [computeIndexFromScroll])

  // Jump helpers with improved smoothness
  const scrollToCard = (i: number) => {
    if (travel <= 0) return
    const idx = Math.max(0, Math.min(cards.length - 1, i))
    const a = getAnchors()
    if (!a) return
    const viewportCenter = vw / 2
    const cardCenter = sidePad + idx * (width + gap) + width / 2
    const desiredX = viewportCenter - cardCenter
    const s = Math.min(1, Math.max(0, -desiredX / Math.max(1, travel)))
    const targetY = a.start + s * a.length

    // Use smooth scrolling with easing
    const startY = window.scrollY
    const distance = targetY - startY
    const duration = 800 // 800ms for smooth transition
    const startTime = performance.now()

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startY + distance * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Partial scroll functions for smoother navigation
  const onPrev = () => {
    if (travel <= 0) return
    const a = getAnchors()
    if (!a) return

    // Calculate current scroll position
    const currentProgress = (window.scrollY - a.start) / a.length
    const scrollAmount = 0.15 // Scroll 15% of the total travel distance

    const targetProgress = Math.max(0, currentProgress - scrollAmount)
    const targetY = a.start + targetProgress * a.length

    // Use smooth scrolling with easing
    const startY = window.scrollY
    const distance = targetY - startY
    const duration = 600 // Slightly faster for partial scrolls
    const startTime = performance.now()

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startY + distance * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const onNext = () => {
    if (travel <= 0) return
    const a = getAnchors()
    if (!a) return

    // Calculate current scroll position
    const currentProgress = (window.scrollY - a.start) / a.length
    const scrollAmount = 0.15 // Scroll 15% of the total travel distance

    const targetProgress = Math.min(1, currentProgress + scrollAmount)
    const targetY = a.start + targetProgress * a.length

    // Use smooth scrolling with easing
    const startY = window.scrollY
    const distance = targetY - startY
    const duration = 600 // Slightly faster for partial scrolls
    const startTime = performance.now()

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startY + distance * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Drag handlers for scroll bar
  const handleDragStart = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !scrollbarRef.current) return

      const rect = scrollbarRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const p = Math.min(1, Math.max(0, clickX / rect.width))
      const a = getAnchors()
      if (!a) return
      const targetY = a.start + p * a.length
      window.scrollTo(0, targetY)
    },
    [isDragging, getAnchors],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handleDragMove)
      document.addEventListener('pointerup', handleDragEnd)
      return () => {
        document.removeEventListener('pointermove', handleDragMove)
        document.removeEventListener('pointerup', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Scrollbar (half viewport width, centered)
  const progress = useTransform(x, [0, -Math.max(1, travel)], [0, 1])
  const thumbFrac = Math.max(0.08, Math.min(1, vw / Math.max(1, trackWidth)))
  const thumbLeft = useTransform(progress, (p) => `${p * (1 - thumbFrac) * 100}%`)
  const thumbWidth = `${thumbFrac * 100}%`
  const canScroll = travel > 0
  const stickyTop = `calc(50svh - ${viewportHeightPx / 2}px)`

  return (
    <section ref={targetRef} className="relative" style={{ height: sectionHeightPx }}>
      <div className="sticky overflow-hidden" style={{ height: viewportHeightPx, top: stickyTop }}>
        {/* Vertically centered row */}
        <div className="flex h-full items-center">
          <motion.div
            style={{ x, paddingLeft: sidePad, paddingRight: sidePad }}
            className="flex items-center"
          >
            {cards.map((card, i) => {
              return (
                <CardWithTransform
                  key={i}
                  card={card}
                  index={i}
                  width={width}
                  height={height}
                  gap={gap}
                  sidePad={sidePad}
                  vw={vw}
                  focusRadius={focusRadius}
                  minReveal={minReveal}
                  maxReveal={maxReveal}
                  x={x}
                  easeInOutQuad={easeInOutQuad}
                  isLast={i === cards.length - 1}
                />
              )
            })}
          </motion.div>
        </div>

        {/* Bottom scrollbar + arrows */}
        {canScroll && (
          <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-auto">
            <div className="mx-auto w-1/2 max-w-[640px] min-w-[200px] px-2">
              <div className="flex items-center gap-4">
                {/* Track (draggable scroll bar) */}
                <div
                  ref={scrollbarRef}
                  className={`relative h-2 rounded-full bg-neutral-300 flex-1 overflow-hidden ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  onPointerDown={handleDragStart}
                >
                  <motion.div
                    className="absolute top-0 bottom-0 rounded-full bg-black transition-colors hover:bg-gray-800"
                    style={{ left: thumbLeft, width: thumbWidth }}
                  />
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onPrev}
                    aria-label="Previous"
                    className="h-8 w-8 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
                    disabled={!canScroll || currentIndex <= 0}
                  >
                    ‹
                  </button>
                  <button
                    onClick={onNext}
                    aria-label="Next"
                    className="h-8 w-8 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
                    disabled={!canScroll || currentIndex >= cards.length - 1}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Card component with transforms
const CardWithTransform: React.FC<{
  card: CardData
  index: number
  width: number
  height: number
  gap: number
  sidePad: number
  vw: number
  focusRadius: number
  minReveal: number
  maxReveal: number
  x: any
  easeInOutQuad: (t: number) => number
  isLast: boolean
}> = ({
  card,
  index,
  width,
  height,
  gap,
  sidePad,
  vw,
  focusRadius,
  minReveal,
  maxReveal,
  x,
  easeInOutQuad,
  isLast,
}) => {
  // Focus factor (0..1) — 1 at center, 0 far away
  const influence = width * focusRadius
  const focusFactor = useTransform(x, (currX) => {
    const viewportCenter = vw / 2
    const cardCenter = sidePad + index * (width + gap) + width / 2 + (currX as number)
    const dist = Math.abs(cardCenter - viewportCenter)
    const t = Math.max(0, Math.min(1, 1 - dist / Math.max(1, influence)))
    return easeInOutQuad(t)
  })

  // Visible image height (px): 50% when away, 100% when centered
  const visiblePx = useTransform(focusFactor, (f) => {
    return (minReveal + (maxReveal - minReveal) * f) * height
  })

  // Clip FROM THE BOTTOM so the top region remains visible above titles
  const clipPath = useTransform(visiblePx, (v) => {
    const bottomClip = Math.max(0, height - v)
    return `inset(0px 0px ${bottomClip}px 0px)`
  })

  // Scale the image container to create the height change effect
  const imageScale = useTransform(focusFactor, (f) => {
    return 0.8 + 0.2 * f // Scale from 0.8 to 1.0
  })

  return (
    <div className="shrink-0" style={{ marginRight: isLast ? 0 : gap }}>
      <Card card={card} width={width} height={height} clipPath={clipPath} imageScale={imageScale} />
    </div>
  )
}

export const HorizontalScrollCardsBlock: React.FC<HorizontalScrollScrollCardsBlockProps> = (
  props,
) => {
  const { cards, cardWidth = '450', cardHeight = '450' } = props
  if (!cards || cards.length === 0) return null

  const width = parseInt(cardWidth || '450', 10)
  const height = parseInt(cardHeight || '450', 10)

  return (
    <div className="bg-white">
      <HorizontalScrollCarousel
        cards={cards as CardData[]}
        width={width}
        height={height}
        gap={20}
        minReveal={0.5} // ← always half when not centered
        maxReveal={1.0} // ← full at center
        focusRadius={0.6}
      />
    </div>
  )
}
