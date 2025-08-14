'use client'

import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import { AnimatePresence, motion } from 'motion/react'
import { ImageProps } from 'next/image'
import { useOutsideClick } from '@/hooks/use-outside-click'

interface CarouselProps {
  items: React.ReactElement[]
  initialScroll?: number
}

type Card = {
  src: string
  title: string
  category: string
  content: React.ReactNode
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({ onCardClose: () => {}, currentIndex: 0 })

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const isMobile = () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    if (!ref.current) return
    ref.current.scrollLeft = initialScroll
    updateArrows()
    // Recalculate on resize
    const onResize = () => updateArrows()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateArrows = () => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanLeft(scrollLeft > 0)
    // add 2px tolerance for fractional widths
    setCanRight(scrollLeft < scrollWidth - clientWidth - 2)
  }

  const scrollByAmount = (delta: number) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const goLeft = () => scrollByAmount(-(isMobile() ? 320 : 440))
  const goRight = () => scrollByAmount(isMobile() ? 320 : 440)

  const handleCardClose = (index: number) => {
    const el = ref.current
    if (!el) return
    const cardW = isMobile() ? 300 : 420
    const gap = isMobile() ? 16 : 24
    el.scrollTo({ left: (cardW + gap) * index, behavior: 'smooth' })
    setCurrentIndex(index)
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative">
        {/* right fade like the screenshot */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-950 to-transparent md:w-28" />

        <div
          ref={ref}
          onScroll={updateArrows}
          className={cn(
            'flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-6 md:gap-6 md:py-10',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {items.map((el, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 * i, ease: 'easeOut' }}
              className="snap-start"
            >
              {el}
            </motion.div>
          ))}
          {/* trailing padding so last card isn't glued to the edge */}
          <div className="min-w-[8%] md:min-w-[20%]" />
        </div>

        {/* Nav arrows – compact, bottom-left like the screenshot */}
        <div className="mt-2 flex items-center gap-2 md:mt-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 disabled:opacity-40"
            onClick={goLeft}
            disabled={!canLeft}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 disabled:opacity-40"
            onClick={goRight}
            disabled={!canRight}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card
  index: number
  layout?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onCardClose } = useContext(CarouselContext)

  const handleClose = useCallback(() => {
    setOpen(false)
    onCardClose(index)
  }, [onCardClose, index])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && handleClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleClose])

  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, () => handleClose())

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 max-w-5xl rounded-3xl bg-white p-6 md:p-10"
            >
              <button
                className="sticky top-2 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-3 text-2xl font-semibold text-neutral-800 md:text-4xl"
              >
                {card.title}
              </motion.p>
              <div className="py-8">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-[420px] w-[300px] flex-col overflow-hidden rounded-3xl bg-neutral-200 md:h-[500px] md:w-[380px] xl:h-[520px] xl:w-[420px]"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-20 p-6">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left text-xl font-semibold text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-[5] object-cover"
        />
      </motion.button>
    </>
  )
}

export const BlurImage = ({ height, width, src, className, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true)
  return (
    <img
      className={cn(
        'h-full w-full transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt ?? 'Background image'}
      {...rest}
    />
  )
}
