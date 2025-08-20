'use client'

import React, { useEffect, useRef } from 'react'
import type { HorizontalScrollCardsBlock as HorizontalScrollCardsBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

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

  const RIGHT_PAD_PX = 150

  const calcDynamicHeight = () => {
    if (typeof window === 'undefined') return 0
    const track = horizontalRef.current
    const sticky = stickyRef.current
    if (!track || !sticky) return 0

    const vw = window.innerWidth
    const vh = sticky.offsetHeight || window.innerHeight
    const objectWidth = track.scrollWidth
    return objectWidth - vw + vh + RIGHT_PAD_PX
  }

  useEffect(() => {
    const sh = spaceHolderRef.current
    const hr = horizontalRef.current
    if (!sh || !hr) return

    const setHeight = () => {
      sh.style.height = `${calcDynamicHeight()}px`
    }

    const onScroll = () => {
      const sticky = stickyRef.current
      if (!sticky || !hr) return
      const topPx = parseFloat(getComputedStyle(sticky).top || '0') || 0
      // Normalize so horizontal translation starts at 0 even when sticky is offset from the top
      const progress = Math.max(0, sticky.offsetTop - topPx)
      hr.style.transform = `translateX(-${progress}px)`
    }

    setHeight()
    onScroll()

    const roSticky = stickyRef.current ? new ResizeObserver(setHeight) : null
    const roTrack = horizontalRef.current ? new ResizeObserver(setHeight) : null
    roSticky?.observe(stickyRef.current as Element)
    roTrack?.observe(horizontalRef.current as Element)

    window.addEventListener('resize', setHeight)
    window.addEventListener('load', setHeight)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', setHeight)
      window.removeEventListener('load', setHeight)
      window.removeEventListener('scroll', onScroll as any)
      roSticky?.disconnect()
      roTrack?.disconnect()
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
          {/* ↓ Move sticky down a bit (tweak values as you like) */}
          <div
            ref={stickyRef}
            className="sticky [--sticky-top:120px] sm:[--sticky-top:130px] md:[--sticky-top:140px] lg:[--sticky-top:150px] top-[var(--sticky-top)] h-[80vh] w-full overflow-x-hidden"
          >
            <div ref={horizontalRef} className="absolute h-full will-change-transform">
              <section
                role="feed"
                className="relative h-full pl-[20px] sm:pl-[72px] md:pl-[120px] lg:pl-[150px] flex flex-row flex-nowrap justify-start items-start pt-2 pb-4"
              >
                {cards.map((card: CardData, i: number) => (
                  <article
                    key={i}
                    className="relative w-[320px] sm:w-[380px] md:w-[420px] lg:w-[640px] mr-[20px] sm:mr-[36px] md:mr-[48px] lg:mr-[56px] flex-shrink-0 overflow-hidden bg-white flex flex-col"
                    style={{ height: `${cardHeight}px` }}
                  >
                    <div className="h-[62%] bg-gray-100 relative">
                      <Media
                        resource={card.image}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover object-center block"
                      />
                    </div>
                    <div className="p-4 md:p-5 lg:p-6">
                      <h3 className="text-2xl xl:text-2xl 2xl:text-3xl leading-tight mb-2 text-black">
                        {card.title}
                      </h3>
                      {card.description ? (
                        <p className="mb-2 text-black text-md md:text-base">{card.description}</p>
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
          </div>
        </div>
      </section>
    </div>
  )
}

export default HorizontalScrollCardsBlock
