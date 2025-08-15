'use client'

import * as React from 'react'
import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { motion, useTransform, useScroll, useReducedMotion, useSpring } from 'framer-motion'

import type { HorizontalScrollCardsBlock as HorizontalScrollScrollCardsBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const useViewport = () => {
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [vh, setVh] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800)

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { vw, vh }
}

// Observe if the section is in view so we don't hijack the page scroll when it's off-screen
const useInView = (ref: React.RefObject<Element | null>, options?: IntersectionObserverInit) => {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px', ...(options || {}) },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, options])
  return inView
}

// rAF-based smooth scroll with cancellation + native fallback (option to force rAF for pixel-accurate snaps)
const useSmoothScroll = () => {
  const prefersReduced = useReducedMotion()
  const rafRef = useRef<number | null>(null)

  const cancel = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const scrollToY = useCallback(
    (
      targetY: number,
      duration = 520, // low-latency
      easing: (t: number) => number = (t) => t,
      opts: { forceRAF?: boolean; after?: () => void } = {},
    ) => {
      targetY = Math.round(targetY)
      cancel()

      if (prefersReduced || duration <= 0) {
        window.scrollTo(0, targetY)
        opts.after?.()
        return
      }

      if (!opts.forceRAF) {
        try {
          window.scrollTo({ top: targetY, behavior: 'smooth' as ScrollBehavior })
          window.setTimeout(() => {
            window.scrollTo(0, targetY)
            opts.after?.()
          }, duration + 20)
          return
        } catch {}
      }

      const startY = window.scrollY
      const distance = targetY - startY
      const startTime = performance.now()

      const step = (now: number) => {
        const p = clamp((now - startTime) / duration, 0, 1)
        const e = easing(p)
        window.scrollTo(0, Math.round(startY + distance * e))
        if (p < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          window.scrollTo(0, targetY)
          opts.after?.()
        }
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [prefersReduced],
  )

  useEffect(() => () => cancel(), [])

  return scrollToY
}

// Easing
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

// ------------------------------------------------------
// Types
// ------------------------------------------------------

type CardData = {
  title: string
  description?: string
  image: any
  enableLink?: boolean
  link?: any
}

// ------------------------------------------------------
// Card
// ------------------------------------------------------

const Card: React.FC<{
  card: CardData
  width: number
  height: number
  clipPath: any // MotionValue<string>
  imageScale?: any // MotionValue<number>
}> = ({ card, width, height, clipPath, imageScale }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white"
      style={{ width, height }}
    >
      {/* Static full-size image; visibility controlled by clip-path (trim from BOTTOM) */}
      <motion.div
        className="absolute inset-0 will-change-[clip-path,transform]"
        style={{ clipPath, scale: imageScale || 1, transformOrigin: 'center center' }}
      >
        <Media
          resource={card.image}
          imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      {/* Bottom content area with solid background so image never shows beneath */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-5 md:p-6 pointer-events-none">
        <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-white/95 backdrop-blur pointer-events-auto shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 line-clamp-2">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-3">
              {card.description}
            </p>
          )}
          {card.enableLink && card.link && (
            <div className="mt-3 md:mt-4">
              <CMSLink {...card.link} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------
// Carousel
// ------------------------------------------------------

const HorizontalScrollCarousel: React.FC<{
  cards: CardData[]
  width: number
  height: number
  gap?: number
  minReveal?: number // 0..1
  maxReveal?: number // 0..1
  focusRadius?: number
}> = ({ cards, width, height, gap = 20, minReveal = 0.5, maxReveal = 1.0, focusRadius = 0.6 }) => {
  const [isDragging, setIsDragging] = useState(false)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)
  const { vw, vh } = useViewport()
  const scrollToY = useSmoothScroll()

  // Track scroll direction (for escape zones)
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0)
  const scrollDirRef = useRef<'up' | 'down'>('down')

  // Responsive card sizing
  const { cardW, cardH, cardGap } = useMemo(() => {
    const isMobile = vw < 640
    const isTablet = vw >= 640 && vw < 1024

    const safeInset = 32
    const mobileW = vw - Math.max(56, safeInset * 2)

    const base = isMobile ? mobileW : isTablet ? Math.min(width, Math.floor(vw * 0.55)) : width
    const w = clamp(base, 240, width)
    const h = Math.round((height / width) * w)
    const g = isMobile ? 12 : isTablet ? 18 : gap

    return { cardW: w, cardH: h, cardGap: g }
  }, [vw, width, height, gap])

  // Layout
  const sidePad = Math.max(0, (vw - cardW) / 2)
  const trackWidth = cards.length * cardW + (cards.length - 1) * cardGap + sidePad * 2
  const travel = Math.max(0, trackWidth - vw)

  // Vertical section height sized by travel so the horizontal motion completes exactly once
  const viewportHeightPx = clamp(cardH + 120, 420, Math.min(720, Math.max(520, vh * 0.7)))
  const sectionHeightPx = viewportHeightPx + travel + 120 // cushion

  const { scrollYProgress } = useScroll({ target: targetRef })
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const x = useSpring(xRaw, { stiffness: 220, damping: 24, mass: 0.34 })

  // Anchors
  const getAnchors = useCallback(() => {
    const node = targetRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const topAbs = window.scrollY + rect.top
    const start = topAbs - (window.innerHeight - viewportHeightPx) / 2
    const end = start + (sectionHeightPx - (window.innerHeight - viewportHeightPx))
    const length = Math.max(1, end - start)
    return { start, end, length }
  }, [sectionHeightPx, viewportHeightPx])

  // Observe visibility to avoid hijacking scroll when off-screen
  const isInView = useInView(targetRef, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  // Geometry helpers
  const cardCenterAt = useCallback(
    (idx: number, currX = 0) => sidePad + idx * (cardW + cardGap) + cardW / 2 + currX,
    [sidePad, cardW, cardGap],
  )
  const progressForIndex = useCallback(
    (idx: number) => {
      const viewportCenter = vw / 2
      const cardCenter = cardCenterAt(idx, 0)
      const desiredX = viewportCenter - cardCenter
      return clamp(-desiredX / Math.max(1, travel), 0, 1)
    },
    [vw, cardCenterAt, travel],
  )

  // Current index
  const [currentIndex, setCurrentIndex] = useState(0)
  const computeIndexFromScroll = useCallback(() => {
    const a = getAnchors()
    if (!a) return 0
    const p = clamp((window.scrollY - a.start) / a.length, 0, 1)
    const currX = -travel * p
    const viewportCenter = vw / 2
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < cards.length; i++) {
      const cardCenter = cardCenterAt(i, currX)
      const d = Math.abs(cardCenter - viewportCenter)
      if (d < best) {
        best = d
        nearest = i
      }
    }
    return nearest
  }, [cards.length, cardCenterAt, travel, vw, getAnchors])

  // Accurate snap after scroll pause — escape zones at top (all) and bottom (mobile)
  useEffect(() => {
    if (!isInView) return

    let quietTimer: number | null = null
    const onScroll = () => {
      const a = getAnchors()
      if (!a) return

      // track direction
      const currY = window.scrollY
      scrollDirRef.current = currY < lastScrollYRef.current ? 'up' : 'down'
      lastScrollYRef.current = currY

      // ignore when far outside our band's vertical range
      if (currY < a.start - 40 || currY > a.end + 40) return

      setCurrentIndex(computeIndexFromScroll())
      if (quietTimer) window.clearTimeout(quietTimer)

      quietTimer = window.setTimeout(() => {
        const anchors = getAnchors()
        if (!anchors) return
        const idx = computeIndexFromScroll()

        // compute progress within band and proximity to center
        const viewportCenter = vw / 2
        const p = clamp((window.scrollY - anchors.start) / anchors.length, 0, 1)
        const currX = -travel * p
        const centerPx = Math.abs(cardCenterAt(idx, currX) - viewportCenter)
        const snapThreshold = Math.max(48, cardW * 0.25)

        // Escape zone near the top when scrolling up (all viewports)
        const nearTop = p < 0.12
        if (nearTop && scrollDirRef.current === 'up') return

        // NEW: Escape zone near the bottom when scrolling down on MOBILE
        const isMobile = vw < 640
        const nearBottom = p > 0.88
        if (isMobile && nearBottom && scrollDirRef.current === 'down') return

        // Only snap if close enough to a card center
        if (centerPx > snapThreshold) return

        const s = progressForIndex(idx)
        const targetY = anchors.start + s * anchors.length
        scrollToY(targetY, 520, easeOutQuint, { forceRAF: true })
      }, 90)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (quietTimer) window.clearTimeout(quietTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [
    isInView,
    getAnchors,
    computeIndexFromScroll,
    vw,
    travel,
    cardCenterAt,
    cardW,
    progressForIndex,
    scrollToY,
  ])

  // Programmatic scrolling
  const scrollToProgress = useCallback(
    (p: number, forceAccurate = false) => {
      const a = getAnchors()
      if (!a) return
      const targetY = a.start + clamp(p, 0, 1) * a.length
      scrollToY(targetY, 520, easeInOutCubic, { forceRAF: forceAccurate })
    },
    [getAnchors, scrollToY],
  )

  const scrollToCard = useCallback(
    (i: number) => {
      if (travel <= 0) return
      const idx = clamp(i, 0, cards.length - 1)
      const s = progressForIndex(idx)
      scrollToProgress(s, true)
    },
    [cards.length, travel, progressForIndex, scrollToProgress],
  )

  // Buttons — always able to reach hard edges
  const onPrev = () => {
    if (currentIndex <= 0) return scrollToProgress(0, true)
    scrollToCard(currentIndex - 1)
  }
  const onNext = () => {
    if (currentIndex >= cards.length - 1) return scrollToProgress(1, true)
    scrollToCard(currentIndex + 1)
  }

  // Drag handlers for scroll bar (rAF throttled) + precise snap on release
  const [dragging, setDragging] = useState(false)
  const rafMove = useRef<number | null>(null)

  const handleDragStart = (e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || !scrollbarRef.current) return
      const rect = scrollbarRef.current.getBoundingClientRect()
      const clickX = clamp(e.clientX - rect.left, 0, rect.width)
      const p = rect.width > 0 ? clickX / rect.width : 0
      const a = getAnchors()
      if (!a) return

      const run = () => {
        const targetY = a.start + p * a.length
        window.scrollTo(0, targetY)
        rafMove.current = null
      }
      if (rafMove.current == null) rafMove.current = requestAnimationFrame(run)
    },
    [dragging, getAnchors],
  )

  const handleDragEnd = useCallback(() => {
    setDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    // Snap to the precise nearest card after drag end if still in view
    const a = getAnchors()
    if (!a) return
    if (!isInView) return
    const idx = computeIndexFromScroll()
    const s = progressForIndex(idx)
    const targetY = a.start + s * a.length
    scrollToY(targetY, 520, easeOutQuint, { forceRAF: true })
  }, [getAnchors, isInView, computeIndexFromScroll, progressForIndex, scrollToY])

  useEffect(() => {
    if (!dragging) return
    document.addEventListener('pointermove', handleDragMove)
    document.addEventListener('pointerup', handleDragEnd)
    return () => {
      document.removeEventListener('pointermove', handleDragMove)
      document.removeEventListener('pointerup', handleDragEnd)
    }
  }, [dragging, handleDragMove, handleDragEnd])

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
            {cards.map((card, i) => (
              <CardWithTransform
                key={i}
                card={card}
                index={i}
                width={cardW}
                height={cardH}
                gap={cardGap}
                sidePad={sidePad}
                vw={vw}
                focusRadius={focusRadius}
                minReveal={minReveal}
                maxReveal={maxReveal}
                x={x}
                isLast={i === cards.length - 1}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom scrollbar + arrows */}
        {canScroll && (
          <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-auto">
            <div className="mx-auto w-[clamp(200px,50vw,640px)] px-2">
              <div className="flex items-center gap-4">
                {/* Track (draggable scroll bar) */}
                <div
                  ref={scrollbarRef}
                  className={`relative h-2 rounded-full bg-neutral-300 flex-1 overflow-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onPointerDown={handleDragStart}
                >
                  <motion.div
                    className="absolute top-0 bottom-0 rounded-full bg-black transition-colors hover:bg-gray-800"
                    style={{ left: thumbLeft, width: thumbWidth }}
                  />
                </div>

                {/* Arrows (never disabled except when no travel) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onPrev}
                    aria-label="Previous"
                    className="h-9 w-9 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
                    disabled={!canScroll}
                  >
                    ‹
                  </button>
                  <button
                    onClick={onNext}
                    aria-label="Next"
                    className="h-9 w-9 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
                    disabled={!canScroll}
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

// ------------------------------------------------------
// Card with transforms
// ------------------------------------------------------

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
  isLast,
}) => {
  const influence = width * focusRadius
  const focusFactor = useTransform(x, (currX: number) => {
    const viewportCenter = vw / 2
    const cardCenter = sidePad + index * (width + gap) + width / 2 + currX
    const dist = Math.abs(cardCenter - viewportCenter)
    const t = clamp(1 - dist / Math.max(1, influence), 0, 1)
    return t * t * (3 - 2 * t) // smoothstep: responsive but not overly floaty
  })

  const visiblePx = useTransform(
    focusFactor,
    (f) => minReveal * height + (maxReveal - minReveal) * f * height,
  )
  const clipPath = useTransform(visiblePx, (v) => `inset(0px 0px ${Math.max(0, height - v)}px 0px)`)
  const imageScale = useTransform(focusFactor, (f) => 0.84 + 0.16 * f)

  return (
    <div className="shrink-0" style={{ marginRight: isLast ? 0 : gap }}>
      <Card card={card} width={width} height={height} clipPath={clipPath} imageScale={imageScale} />
    </div>
  )
}

// ------------------------------------------------------
// Public block
// ------------------------------------------------------

export const HorizontalScrollCardsBlock: React.FC<HorizontalScrollScrollCardsBlockProps> = (
  props,
) => {
  const { cards, cardWidth = '450', cardHeight = '450' } = props
  if (!cards || cards.length === 0) return null

  // Treat these as maximums; component scales down responsively
  const width = parseInt(cardWidth || '450', 10)
  const height = parseInt(cardHeight || '450', 10)

  return (
    <div className="bg-white">
      <HorizontalScrollCarousel
        cards={cards as CardData[]}
        width={width}
        height={height}
        gap={22}
        minReveal={0.5}
        maxReveal={1.0}
        focusRadius={0.6}
      />
    </div>
  )
}
