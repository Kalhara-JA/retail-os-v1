'use client'

import * as React from 'react'
import { useRef, useEffect, useCallback, useState, useMemo, useLayoutEffect } from 'react'
import { motion, useTransform, useScroll, useReducedMotion } from 'framer-motion'

import type { HorizontalScrollCardsBlock as HorizontalScrollScrollCardsBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const useViewport = () => {
  const [{ vw, vh, ready }, set] = useState({ vw: 1200, vh: 800, ready: false })
  useLayoutEffect(() => {
    const update = () => {
      const vv = window.visualViewport
      const nextVW = Math.round(vv?.width ?? window.innerWidth)
      const nextVH = Math.round(vv?.height ?? window.innerHeight)
      set({ vw: nextVW, vh: nextVH, ready: true })
    }
    update()
    const vv = window.visualViewport
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return { vw, vh, ready }
}

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
      duration = 520,
      easing: (t: number) => number = (t) => t,
      opts: { forceRAF?: boolean; after?: () => void } = {},
    ) => {
      targetY = Math.round(targetY)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
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
// Card (stacked layout on all breakpoints)
// ------------------------------------------------------

// Mobile (<sm): image height animates (visiblePx), text below.
// Desktop (>=sm): image sits in a fixed-height box; we animate clip from the TOP.
// Text never moves and is fully visible.
const Card: React.FC<{
  card: CardData
  width: number
  outerHeight: number
  imageHeight: number
  visiblePx: any
  imageScale?: any
}> = ({ card, width, outerHeight, imageHeight, visiblePx, imageScale }) => {
  const clipTop = useTransform(visiblePx as any, (v: number) => Math.max(0, imageHeight - v))
  const clipPath = useTransform(clipTop, (topPx: number) => `inset(${topPx}px 0px 0px 0px)`)

  return (
    <div
      className="group relative rounded-2xl bg-white overflow-hidden"
      style={{ width, height: outerHeight }}
    >
      <div className="flex flex-col h-full">
        {/* IMAGE (MOBILE) — height animates */}
        <motion.div
          className="relative overflow-hidden block sm:hidden"
          style={{ height: visiblePx }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: imageScale || 1, transformOrigin: '50% 100%' }}
          >
            <Media
              resource={card.image}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover object-bottom origin-bottom"
            />
          </motion.div>
        </motion.div>

        {/* IMAGE (DESKTOP/TABLET) — fixed box, animate top clip */}
        <div className="hidden sm:block relative overflow-hidden" style={{ height: imageHeight }}>
          <motion.div
            className="absolute inset-0 will-change-[clip-path,transform]"
            style={{ clipPath }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ scale: imageScale || 1, transformOrigin: '50% 100%' }}
            >
              <Media
                resource={card.image}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-bottom origin-bottom"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* TEXT (always fully visible on desktop) */}
        <div className="p-4 sm:p-5 md:p-6 mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4">{card.description}</p>
          )}
          {card.enableLink && card.link && (
            <div className="mt-2 md:mt-3">
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
  minReveal?: number // 0..1 of imageHeight
  maxReveal?: number
  focusRadius?: number
}> = ({ cards, width, height, gap = 20, minReveal = 0.62, maxReveal = 1.0, focusRadius = 0.6 }) => {
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)
  const { vw, vh, ready } = useViewport()
  const scrollToY = useSmoothScroll()

  const isMobile = vw < 640

  // Track scroll direction
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0)
  const scrollDirRef = useRef<'up' | 'down'>('down')

  // Responsive sizing
  const { cardW, cardOuterH, imageH, cardGap, sidePad } = useMemo(() => {
    const isTablet = vw >= 640 && vw < 1024

    const mobileSidePad = 16
    const mobileScale = 0.68
    const mobileW = Math.min(width, Math.floor(vw * mobileScale))

    const w = isMobile
      ? clamp(mobileW, 200, Math.min(width, vw - (mobileSidePad + 24)))
      : isTablet
        ? Math.min(width, Math.floor(vw * 0.55))
        : width

    // Image height: slightly smaller on desktop to free space for text
    const baseImgH = Math.round((height / width) * w)
    const imgH = isMobile ? Math.round(baseImgH * 0.9) : Math.round(baseImgH * 0.8)

    // Reserve space for text BELOW image (more generous on desktop)
    const reserve = isMobile
      ? Math.round(Math.max(200, Math.min(320, imgH * 0.55)))
      : Math.round(Math.max(220, Math.min(420, imgH * 0.6)))

    const outerH = imgH + reserve

    const g = isMobile ? 10 : isTablet ? 18 : gap
    const sp = isMobile ? mobileSidePad : Math.max(0, (vw - w) / 2)

    return { cardW: w, cardOuterH: outerH, imageH: imgH, cardGap: g, sidePad: sp }
  }, [vw, width, height, gap, isMobile])

  // Layout
  const trackWidth = cards.length * cardW + (cards.length - 1) * cardGap + sidePad * 2
  const travel = Math.max(0, trackWidth - vw)

  // Vertical section sized by OUTER height
  const viewportHeightPx = clamp(cardOuterH + 120, 420, Math.min(780, Math.max(540, vh * 0.7)))
  const sectionHeightPx = viewportHeightPx + travel + 120

  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  // Anchors
  const getAnchors = useCallback(() => {
    const node = targetRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const topAbs = window.scrollY + rect.top
    const vhNow = Math.round(window.visualViewport?.height ?? window.innerHeight)
    const start = topAbs - (vhNow - viewportHeightPx) / 2
    const end = start + (sectionHeightPx - (vhNow - viewportHeightPx))
    const length = Math.max(1, end - start)
    return { start, end, length }
  }, [sectionHeightPx, viewportHeightPx])

  const isInView = useInView(targetRef, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  useEffect(() => {
    const prev = document.body.style.overscrollBehaviorY
    if (isInView) document.body.style.overscrollBehaviorY = 'none'
    return () => {
      document.body.style.overscrollBehaviorY = prev
    }
  }, [isInView])

  const cardCenterAt = useCallback(
    (idx: number, currX = 0) => sidePad + idx * (cardW + cardGap) + cardW / 2 + currX,
    [sidePad, cardW, cardGap],
  )
  const cardLeftAt = useCallback(
    (idx: number, currX = 0) => sidePad + idx * (cardW + cardGap) + currX,
    [sidePad, cardW, cardGap],
  )

  const progressForIndex = useCallback(
    (idx: number) => {
      const viewportCenter = vw / 2
      if (isMobile) {
        const desiredX = sidePad - (sidePad + idx * (cardW + cardGap))
        return clamp(-desiredX / Math.max(1, travel), 0, 1)
      } else {
        const desiredX = viewportCenter - (sidePad + idx * (cardW + cardGap) + cardW / 2)
        return clamp(-desiredX / Math.max(1, travel), 0, 1)
      }
    },
    [vw, sidePad, cardW, cardGap, travel, isMobile],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const computeIndexFromScroll = useCallback(() => {
    const a = getAnchors()
    if (!a) return 0
    const p = clamp((window.scrollY - a.start) / a.length, 0, 1)
    const currX = -travel * p
    let nearest = 0
    let best = Infinity
    if (isMobile) {
      const leftTarget = sidePad
      for (let i = 0; i < cards.length; i++) {
        const left = cardLeftAt(i, currX)
        const d = Math.abs(left - leftTarget)
        if (d < best) {
          best = d
          nearest = i
        }
      }
    } else {
      const centerTarget = vw / 2
      for (let i = 0; i < cards.length; i++) {
        const center = cardCenterAt(i, currX)
        const d = Math.abs(center - centerTarget)
        if (d < best) {
          best = d
          nearest = i
        }
      }
    }
    return nearest
  }, [cards.length, cardLeftAt, cardCenterAt, travel, vw, getAnchors, isMobile])

  // Normalize once after accurate measure
  const normalizedRef = useRef(false)
  const { ready: vpReady } = useViewport()
  useEffect(() => {
    if (!vpReady || normalizedRef.current) return
    const a = getAnchors()
    if (!a) return
    const y = window.scrollY
    const within = y > a.start - 40 && y < a.end + 40
    if (!within) {
      normalizedRef.current = true
      return
    }
    const idx = computeIndexFromScroll()
    const s = progressForIndex(idx)
    const targetY = a.start + s * a.length
    window.scrollTo(0, Math.round(targetY))
    normalizedRef.current = true
  }, [vpReady, getAnchors, computeIndexFromScroll, progressForIndex])

  // Snap logic
  useEffect(() => {
    if (!isInView) return
    let quietTimer: number | null = null
    const onScroll = () => {
      const a = getAnchors()
      if (!a) return
      const currY = window.scrollY
      const prevY = lastScrollYRef.current
      scrollDirRef.current = currY < prevY ? 'up' : 'down'
      lastScrollYRef.current = currY
      if (currY < a.start - 40 || currY > a.end + 40) return

      setCurrentIndex(computeIndexFromScroll())
      if (quietTimer) window.clearTimeout(quietTimer)

      quietTimer = window.setTimeout(() => {
        const anchors = getAnchors()
        if (!anchors) return
        const idx = computeIndexFromScroll()
        const p = clamp((window.scrollY - anchors.start) / anchors.length, 0, 1)
        const currX = -travel * p
        let distPx: number
        if (isMobile) {
          const leftTarget = sidePad
          distPx = Math.abs(cardLeftAt(idx, currX) - leftTarget)
        } else {
          const centerTarget = vw / 2
          distPx = Math.abs(cardCenterAt(idx, currX) - centerTarget)
        }
        const snapThreshold = isMobile ? Math.max(32, cardW * 0.15) : Math.max(48, cardW * 0.25)
        const nearTop = p < 0.12
        if (nearTop && scrollDirRef.current === 'up') return
        const nearBottom = p > 0.88
        if (isMobile && nearBottom && scrollDirRef.current === 'down') return
        if (distPx > snapThreshold) return
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
    cardLeftAt,
    cardW,
    progressForIndex,
    scrollToY,
    isMobile,
  ])

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

  const onPrev = () => {
    if (currentIndex <= 0) return scrollToProgress(0, true)
    scrollToCard(currentIndex - 1)
  }
  const onNext = () => {
    if (currentIndex >= cards.length - 1) return scrollToProgress(1, true)
    scrollToCard(currentIndex + 1)
  }

  // Draggable scrollbar
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

  // Mobile horizontal swipe
  const panRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startScrollY: 0,
    kind: 'none' as 'none' | 'h' | 'v',
  })
  const onPanPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMobile || travel <= 0) return
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    panRef.current.active = true
    panRef.current.startX = e.clientX
    panRef.current.startY = e.clientY
    panRef.current.startScrollY = window.scrollY
    panRef.current.kind = 'none'
  }
  const onPanPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current.active) return
    const dx = e.clientX - panRef.current.startX
    const dy = e.clientY - panRef.current.startY
    if (panRef.current.kind === 'none') {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) panRef.current.kind = 'h'
      else if (Math.abs(dy) > 8) {
        panRef.current.kind = 'v'
        return
      } else return
    }
    if (panRef.current.kind === 'h') {
      e.preventDefault()
      const a = getAnchors()
      if (!a) return
      const dp = dx / Math.max(1, travel)
      const targetY = clamp(panRef.current.startScrollY - dp * a.length, a.start, a.end)
      window.scrollTo(0, targetY)
    }
  }
  const onPanPointerUp = () => {
    if (!panRef.current.active) return
    panRef.current.active = false
    const a = getAnchors()
    if (!a) return
    if (!isInView) return
    const idx = computeIndexFromScroll()
    const s = progressForIndex(idx)
    const targetY = a.start + s * a.length
    scrollToY(targetY, 420, easeOutQuint, { forceRAF: true })
  }

  const progress = useTransform(x, [0, -Math.max(1, travel)], [0, 1])
  const thumbFrac = Math.max(0.08, Math.min(1, vw / Math.max(1, trackWidth)))
  const thumbLeft = useTransform(progress, (p) => `${p * (1 - thumbFrac) * 100}%`)
  const thumbWidth = `${thumbFrac * 100}%`
  const canScroll = travel > 0

  // Place controls closer to the very bottom
  const controlsBottom = 'bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-0'
  const stickyTop = `calc(50svh - ${viewportHeightPx / 2}px)`

  return (
    <section ref={targetRef} className="relative" style={{ height: sectionHeightPx }}>
      <div
        className="sticky overflow-hidden"
        style={{
          height: viewportHeightPx,
          top: stickyTop,
          overscrollBehaviorY: 'none' as any,
          touchAction: 'pan-y' as any,
          contain: 'layout paint' as any,
        }}
        onPointerDown={onPanPointerDown}
        onPointerMove={onPanPointerMove}
        onPointerUp={onPanPointerUp}
      >
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
                imageH={imageH}
                outerH={cardOuterH}
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

        {canScroll && (
          <div className={`absolute left-0 right-0 z-10 pointer-events-auto ${controlsBottom}`}>
            <div
              className="mx-auto px-4 sm:px-6 md:px-8"
              style={{ width: isMobile ? 'calc(100vw - 32px)' : 'clamp(200px, 50vw, 640px)' }}
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={onPrev}
                    aria-label="Previous"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
                    disabled={!canScroll}
                  >
                    ‹
                  </button>
                  <button
                    onClick={onNext}
                    aria-label="Next"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-neutral-400 grid text-black place-items-center hover:bg-neutral-100 active:scale-95 transition disabled:opacity-40"
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
  imageH: number
  outerH: number
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
  imageH,
  outerH,
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
    return t * t * (3 - 2 * t) // smoothstep
  })

  const visiblePx = useTransform(
    focusFactor,
    (f) => minReveal * imageH + (maxReveal - minReveal) * f * imageH,
  )
  const imageScale = useTransform(focusFactor, (f) => 0.84 + 0.16 * f)

  return (
    <div className="shrink-0 mb-8 lg:mb-12" style={{ marginRight: isLast ? 0 : gap }}>
      <Card
        card={card}
        width={width}
        outerHeight={outerH}
        imageHeight={imageH}
        visiblePx={visiblePx}
        imageScale={imageScale}
      />
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

  const width = parseInt(cardWidth || '450', 10)
  const height = parseInt(cardHeight || '450', 10)

  return (
    <div className="bg-white">
      <HorizontalScrollCarousel
        cards={cards as CardData[]}
        width={width}
        height={height}
        gap={22}
        minReveal={0.62}
        maxReveal={1.0}
        focusRadius={0.6}
      />
    </div>
  )
}
