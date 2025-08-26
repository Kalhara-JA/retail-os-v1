'use client'

import React, { useEffect, useRef } from 'react'
import type { HorizontalScrollCardsBlock as HorizontalScrollCardsBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

// Card shape used in this block

type CardData = {
  title: string
  description?: string
  image: any
  enableLink?: boolean
  link?: any
}

export const HorizontalScrollCardsBlock: React.FC<HorizontalScrollCardsBlockProps> = (
  props: any,
) => {
  const { title, cards = [], cardHeight = '450' } = props || {}
  const spaceHolderRef = useRef<HTMLDivElement | null>(null)
  const horizontalRef = useRef<HTMLDivElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)

  // Scrollbar refs
  const progressTrackRef = useRef<HTMLDivElement | null>(null)
  const progressThumbRef = useRef<HTMLDivElement | null>(null)

  // Drag state
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartLeftRef = useRef(0)

  // Arrow hold state
  const holdIntervalRef = useRef<number | null>(null)

  // Progress cache
  const lastProgressRef = useRef(0)

  // Nudge animation state
  const rafIdRef = useRef<number | null>(null)
  const animStartRef = useRef<number>(0)
  const animFromRef = useRef<number>(0)
  const animToRef = useRef<number>(0)
  const EASE_MS = 200

  // Boot gating so we can start focused on first card
  const bootingRef = useRef(true)

  // Focus calculation throttling
  const focusRafRef = useRef<number | null>(null)

  const RIGHT_PAD_PX = 150
  const MIN_THUMB_PX = 28 // keep it grabbable

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

  const calcDynamicHeight = () => {
    if (typeof window === 'undefined') return 0
    const track = horizontalRef.current
    const sticky = stickyRef.current
    if (!track || !sticky) return 0

    const vw = window.innerWidth
    const vh = sticky.offsetHeight || window.innerHeight
    const objectWidth = track.scrollWidth
    // Vertical travel needed so the sticky can translate fully horizontally
    return objectWidth - vw + vh + RIGHT_PAD_PX
  }

  // How far the content can translate horizontally in px
  const calcMaxTranslateX = () => {
    if (typeof window === 'undefined') return 0
    const track = horizontalRef.current
    if (!track) return 0
    const vw = window.innerWidth
    const objectWidth = track.scrollWidth
    return Math.max(0, objectWidth - vw + RIGHT_PAD_PX)
  }

  // Update thumb size based on viewport/content ratio
  const updateThumbSize = () => {
    const track = horizontalRef.current
    const bar = progressTrackRef.current
    const thumb = progressThumbRef.current
    if (!track || !bar || !thumb) return

    const vw = window.innerWidth
    const contentWidth = track.scrollWidth + RIGHT_PAD_PX // treat pad as part of content
    const barW = bar.getBoundingClientRect().width
    const proportional = barW * Math.min(1, vw / Math.max(1, contentWidth))
    const thumbW = Math.max(MIN_THUMB_PX, proportional)
    thumb.style.width = `${thumbW}px`
  }

  // Position thumb from current horizontal progress
  const positionThumbFromProgress = (progressPx: number) => {
    const bar = progressTrackRef.current
    const thumb = progressThumbRef.current
    const maxX = calcMaxTranslateX()
    if (!bar || !thumb || maxX <= 0) {
      if (thumb) thumb.style.transform = `translateX(0px)`
      return
    }
    const barW = bar.getBoundingClientRect().width
    const thumbW = thumb.getBoundingClientRect().width
    const maxThumbLeft = Math.max(0, barW - thumbW)
    const ratio = clamp(progressPx / maxX, 0, 1)
    const leftPx = ratio * maxThumbLeft
    thumb.style.transform = `translateX(${leftPx}px)`
  }

  // Move content to a given "progress" (0..maxX) and sync thumb
  const applyProgress = (progressPx: number) => {
    const hr = horizontalRef.current
    if (!hr) return
    const maxX = calcMaxTranslateX()
    const clamped = clamp(progressPx, 0, maxX)
    hr.style.transform = `translateX(-${clamped}px)`
    lastProgressRef.current = clamped
    positionThumbFromProgress(clamped)
    scheduleFocusUpdate()
  }

  // ---- Smooth nudge helpers ----
  const cancelAnim = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const animateTo = (toPx: number, ms = EASE_MS) => {
    cancelAnim()
    const from = lastProgressRef.current
    const maxX = calcMaxTranslateX()
    animFromRef.current = from
    animToRef.current = clamp(toPx, 0, maxX)
    animStartRef.current = performance.now()

    const step = (now: number) => {
      const t = clamp((now - animStartRef.current) / ms, 0, 1)
      const v = animFromRef.current + (animToRef.current - animFromRef.current) * easeOutCubic(t)
      applyProgress(v)
      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(step)
      } else {
        rafIdRef.current = null
        applyProgress(animToRef.current) // snap to end
      }
    }
    rafIdRef.current = requestAnimationFrame(step)
  }

  // Step size for arrow buttons — small, ~¼ card (80..180px)
  const computeStepPx = () => {
    if (typeof window === 'undefined') return 120
    const hr = horizontalRef.current
    const firstCard = hr?.querySelector('article') as HTMLElement | null
    if (!firstCard) return clamp(window.innerWidth * 0.12, 80, 160)
    const style = window.getComputedStyle(firstCard)
    const mr = parseFloat(style.marginRight || '0')
    const cardW = firstCard.getBoundingClientRect().width + mr
    return clamp(cardW * 0.25, 80, 180)
  }

  const nudgeProgress = (delta: number) => {
    animateTo(lastProgressRef.current + delta)
  }

  // Arrow press & hold handling
  const startHold = (dir: -1 | 1) => {
    const step = computeStepPx()
    nudgeProgress(dir * step)
    stopHold()
    // repeat slower & small for gentle continuous scroll
    holdIntervalRef.current = window.setInterval(() => {
      nudgeProgress(dir * step)
    }, 160)
    window.addEventListener('pointerup', stopHold, { once: true })
    window.addEventListener('pointercancel', stopHold, { once: true })
  }

  const stopHold = () => {
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  // ---- Focus / cropping logic ----
  const focusFirstNow = () => {
    const hr = horizontalRef.current
    if (!hr) return
    const articles = Array.from(hr.querySelectorAll('article')) as HTMLElement[]
    if (!articles.length) return
    articles.forEach((el, i) => {
      if (i === 0) {
        el.style.setProperty('--img-clip-top', '0%')
        el.setAttribute('data-focused', 'true')
      } else {
        el.style.setProperty('--img-clip-top', '50%')
        el.removeAttribute('data-focused')
      }
    })
  }

  
  const scheduleFocusUpdate = () => {
    if (focusRafRef.current != null) return
    focusRafRef.current = requestAnimationFrame(() => {
      focusRafRef.current = null
      updateFocus()
    })
  }

  const updateFocus = () => {
    const hr = horizontalRef.current
    if (!hr) return

    const articles = Array.from(hr.querySelectorAll('article')) as HTMLElement[]
    if (!articles.length) return

    const maxX = calcMaxTranslateX()
    const progress = lastProgressRef.current
    const EDGE_EPS = 2 // px tolerance for start/end snapping

    let bestIdx = 0

    // Snap focus at the very start and very end
    if (progress <= EDGE_EPS) {
      bestIdx = 0
    } else if (Math.abs(progress - maxX) <= EDGE_EPS) {
      bestIdx = articles.length - 1
    } else {
      // Otherwise pick the card whose center is closest to viewport center
      const viewportCenter = window.innerWidth / 2
      let bestDist = Infinity
      for (let i = 0; i < articles.length; i++) {
        const r = articles[i].getBoundingClientRect()
        const center = r.left + r.width / 2
        const dist = Math.abs(center - viewportCenter)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      }
    }

    // Apply CSS var to drive image crop and a helper attribute for future styling
    for (let i = 0; i < articles.length; i++) {
      const el = articles[i]
      if (i === bestIdx) {
        el.style.setProperty('--img-clip-top', '0%') // focused → full image
        el.setAttribute('data-focused', 'true')
      } else {
        el.style.setProperty('--img-clip-top', '50%') // unfocused → crop top half
        el.removeAttribute('data-focused')
      }
    }
  }

  useEffect(() => {
    const sh = spaceHolderRef.current
    const hr = horizontalRef.current
    if (!sh || !hr) return

    const onScroll = () => {
      if (isDraggingRef.current) return // don't fight drag
      const sticky = stickyRef.current
      const sh = spaceHolderRef.current
      if (!sticky || !sh) return
      const topPx = parseFloat(getComputedStyle(sticky).top || '0') || 0

      // Use absolute Y for the spacer's top to match window.scrollY space
      const pageY = window.scrollY || window.pageYOffset || 0
      const shTopAbs = sh.getBoundingClientRect().top + pageY
      const startY = shTopAbs - topPx

      const raw = pageY - startY
      const maxX = calcMaxTranslateX()
      const progress = clamp(raw, 0, maxX)

      hr.style.transform = `translateX(-${progress}px)`
      lastProgressRef.current = progress
      positionThumbFromProgress(progress)
      cancelAnim() // user scrolled; kill button animation
      scheduleFocusUpdate()
    }

    const setHeight = () => {
      sh.style.height = `${calcDynamicHeight()}px`
      updateThumbSize()
      onScroll()
      scheduleFocusUpdate()
    }

    // Drag handlers
    const onWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const bar = progressTrackRef.current
      const thumb = progressThumbRef.current
      if (!bar || !thumb) return
      const barRect = bar.getBoundingClientRect()
      const thumbW = thumb.getBoundingClientRect().width
      const maxThumbLeft = Math.max(0, barRect.width - thumbW)

      const delta = e.clientX - dragStartXRef.current
      let newLeft = dragStartLeftRef.current + delta
      newLeft = clamp(newLeft, 0, maxThumbLeft)

      const ratio = maxThumbLeft > 0 ? newLeft / maxThumbLeft : 0
      const targetProgress = ratio * calcMaxTranslateX()
      cancelAnim()
      applyProgress(targetProgress)
    }

    const onWindowPointerUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
    }

    const onThumbPointerDown = (e: PointerEvent) => {
      const bar = progressTrackRef.current
      const thumb = progressThumbRef.current
      if (!bar || !thumb) return
      isDraggingRef.current = true
      ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
      dragStartXRef.current = e.clientX
      const m = /translateX\(([-0-9.]+)px\)/.exec(thumb.style.transform || '')
      const currentLeft = m ? parseFloat(m[1]) : 0
      dragStartLeftRef.current = currentLeft
      cancelAnim()
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
      window.addEventListener('pointerup', onWindowPointerUp, { passive: true })
    }

    const onTrackPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).dataset.thumb === 'true') return
      const bar = progressTrackRef.current
      const thumb = progressThumbRef.current
      if (!bar || !thumb) return
      const barRect = bar.getBoundingClientRect()
      const thumbW = thumb.getBoundingClientRect().width
      const clickX = e.clientX - barRect.left
      const targetLeft = clamp(clickX - thumbW / 2, 0, barRect.width - thumbW)
      const ratio = barRect.width - thumbW > 0 ? targetLeft / (barRect.width - thumbW) : 0
      const targetProgress = ratio * calcMaxTranslateX()
      animateTo(targetProgress) // smooth to clicked spot
    }

    // Listeners/observers
    const thumbEl = progressThumbRef.current
    const trackEl = progressTrackRef.current
    thumbEl?.addEventListener('pointerdown', onThumbPointerDown)
    trackEl?.addEventListener('pointerdown', onTrackPointerDown)

    setHeight()
    const roSticky = stickyRef.current ? new ResizeObserver(setHeight) : null
    const roTrack = horizontalRef.current ? new ResizeObserver(setHeight) : null
    roSticky?.observe(stickyRef.current as Element)
    roTrack?.observe(horizontalRef.current as Element)

    window.addEventListener('resize', setHeight)
    window.addEventListener('load', setHeight)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Set initial visual focus to the first card before enabling auto focus updates
    focusFirstNow()
    bootingRef.current = false

    return () => {
      window.removeEventListener('resize', setHeight)
      window.removeEventListener('load', setHeight)
      window.removeEventListener('scroll', onScroll as any)
      roSticky?.disconnect()
      roTrack?.disconnect()
      thumbEl?.removeEventListener('pointerdown', onThumbPointerDown)
      trackEl?.removeEventListener('pointerdown', onTrackPointerDown)
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
      stopHold()
      cancelAnim()
      if (focusRafRef.current != null) {
        cancelAnimationFrame(focusRafRef.current)
        focusRafRef.current = null
      }
    }
  }, [cards])

  if (!cards?.length) return null

  const titleText = String(title ?? '')
  const hasFullStops = titleText.includes('.')
  const sentences = hasFullStops
    ? (titleText.match(/[^.]+(?:\.)?/g) || []).map((s) => s)
    : [titleText]

  return (
    <div className="bg-white">
      {title ? (

        <div className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-0 bg-white w-full">
          <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12">
            <h2 className="text-3xl md:text-4xl text-black lg:text-7xl font-light md:font-normal !leading-[1.2]">
              {hasFullStops
                ? sentences.map((sentence, index) => (
                    <React.Fragment key={`sentence-${index}`}>
                      <span className="whitespace-nowrap">{sentence.trim()}</span>
                      {index < sentences.length - 1 ? <> <wbr /> </> : null}
                    </React.Fragment>
                  ))
                : title}
            </h2>
          </div>
        </div>
      ) : null}

      {/* Sticky horizontal section */}
      <section className="relative w-full">
        <div ref={spaceHolderRef} className="relative w-full">
          <div
            ref={stickyRef}
            className="sticky [--sticky-top:120px] sm:[--sticky-top:130px] md:[--sticky-top:140px] lg:[--sticky-top:170px] top-[var(--sticky-top)] h-[80vh] w-full overflow-x-hidden"
          >
            {/* Horizontally translated track */}
            <div ref={horizontalRef} className="absolute h-full will-change-transform">
              <section
                role="feed"
                className="relative h-full pl-[20px] sm:pl-[72px] md:pl-[120px] lg:pl-[150px] flex flex-row flex-nowrap justify-start items-start pt-2 pb-14"
              >
                {cards.map((card: CardData, i: number) => (
                  <article
                    key={i}
                    className="relative w-[320px] sm:w-[380px] md:w-[420px] lg:w-[640px] mr-[20px] sm:mr-[36px] md:mr-[48px] lg:mr-[56px] flex-shrink-0 overflow-hidden bg-white flex flex-col"
                    style={{ height: `${cardHeight}px` }}
                  >
                    {/*
                      Image wrapper keeps the original block height (62%).
                      We crop the TOP of the image using clip-path driven by --img-clip-top.
                      Focused card → 0% (no crop). Others → 50% (half height visible, from bottom).
                    */}
                    <div className="h-[62%] bg-white relative overflow-hidden">
                      <div
                        className="w-full h-full"
                        style={{
                          clipPath: 'inset(var(--img-clip-top, 50%) 0 0 0)',
                          WebkitClipPath: 'inset(var(--img-clip-top, 50%) 0 0 0)' as any,
                          transition: 'clip-path 300ms cubic-bezier(0.2, 0.6, 0.2, 1)',
                          willChange: 'clip-path',
                        }}
                      >
                        <Media
                          resource={card.image}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover object-center block"
                        />
                      </div>
                    </div>

                    <div className="py-4 md:py-5 lg:py-6">
                      <h3 className="text-2xl xl:text-2xl 2xl:text-3xl leading-tight mb-2 text-black">
                        {card.title}
                      </h3>
                      {card.description ? (
                        <p className="mb-2 text-black text-md md:text-xl font-normal">{card.description}</p>
                      ) : null}
                      {card.enableLink && card.link ? (
                        <div className="mt-auto">
                          <CMSLink {...card.link} />
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </section>
            </div>

            {/* Draggable scrollbar (reduced width) + arrow-head buttons on the right */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center pointer-events-none" aria-hidden="true">
              <div className="relative w-[60%] sm:w-[55%] md:w-[50%] max-w-[840px] pointer-events-none">
                <div
                  ref={progressTrackRef}
                  role="scrollbar"
                  aria-orientation="horizontal"
                  className="pointer-events-auto w-full h-2 bg-gray-200 overflow-hidden relative touch-none"
                >
                  <div
                    ref={progressThumbRef}
                    data-thumb="true"
                    className="absolute top-0 left-0 h-full bg-black cursor-grab active:cursor-grabbing touch-none"
                    style={{ width: '40px', transform: 'translateX(0px)' }}
                  />
                </div>

                {/* Arrow buttons anchored to the RIGHT of the bar */}
                <div className="pointer-events-auto absolute right-[-60px] top-1/2 -translate-y-1/2 flex gap-0">
                  {/* Left arrow (arrow head only) */}
                  <button
                    type="button"
                    aria-label="Scroll left"
                    className="w-7 h-7 rounded-full bg-white/0 hover:bg-black/5 active:bg-black/10 flex items-center justify-center"
                    onClick={() => nudgeProgress(-computeStepPx())}
                    onPointerDown={(e) => { e.preventDefault(); startHold(-1) }}
                    onPointerUp={stopHold}
                    onPointerCancel={stopHold}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nudgeProgress(-computeStepPx()) } }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <polyline points="14 6 8 12 14 18" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Right arrow (arrow head only) */}
                  <button
                    type="button"
                    aria-label="Scroll right"
                    className="w-7 h-7 rounded-full bg-white/0 hover:bg-black/5 active:bg-black/10 flex items-center justify-center"
                    onClick={() => nudgeProgress(computeStepPx())}
                    onPointerDown={(e) => { e.preventDefault(); startHold(1) }}
                    onPointerUp={stopHold}
                    onPointerCancel={stopHold}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nudgeProgress(computeStepPx()) } }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <polyline points="10 6 16 12 10 18" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* /controls */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HorizontalScrollCardsBlock
