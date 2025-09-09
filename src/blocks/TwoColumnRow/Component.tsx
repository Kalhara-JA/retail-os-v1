'use client'

import React, { useMemo } from 'react'
import RichText from '@/components/RichText'
import type { TwoColumnRowBlock as TwoColumnRowBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import { MoveRight } from 'lucide-react'

/* ------------------------ columns ------------------------ */

const TextColumn: React.FC<{ content: any }> = ({ content }) => {
  const { headline, title, bodyText, enableLink, link } = content || {}

  return (
    <div className="bg-gray-100 h-full flex items-start">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-20 flex flex-col space-y-6">
        {headline && (
          <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12">
            <p className="text-2xl font-light text-black tracking-wide">{headline}</p>
          </div>
        )}
        {title && (
          <div className="w-full sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-10/12 2xl:w-10/12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-black leading-[1.1] md:leading-[1.1] lg:leading-[1.2]">
              {title}
            </h2>
          </div>
        )}
        {bodyText && (
          <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-10/12  text-black leading-relaxed">
            <RichText
              data={bodyText}
              className="text-black text-xl !leading-[1.8] font-light capitalize"
              enableGutter={false}
            />
          </div>
        )}
        {enableLink && link && (
          <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12 pt-4 text-black font-bold hover:underline transition-all duration-300">
            <div className="flex items-center gap-2 text-base md:text-lg lg:text-xl xl:text-2xl">
              <CMSLink {...link} />
              <MoveRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 font-light" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const MediaColumn: React.FC<{ content: any }> = ({ content }) => {
  const {
    media,
    overlayText,
    overlayLines,
    hideOverlayOnDesktop,
    enableLink,
    link,
    autoPlay,
    controls,
  } = content || {}

  return (
    <div className="relative h-full w-full">
      {media && (
        <div className="relative h-full w-full">
          <Media
            resource={media}
            imgClassName="w-full h-auto object-contain bg-white"
            videoClassName="w-full h-auto object-contain bg-black"
            autoPlay={Boolean(autoPlay)}
            controls={Boolean(controls)}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 lg:hidden" />
          {(Array.isArray(overlayLines) && overlayLines.length > 0) || overlayText ? (
            <div
              className={`absolute inset-0 flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-16 ${hideOverlayOnDesktop ? 'lg:hidden' : ''}`}
            >
              <div className="text-left text-white w-full">
                <div className="text-3xl md:text-4xl lg:text-6xl 2xl:text-7xl font-light md:font-normal !leading-[1.1] md:!leading-[1.1] lg:!leading-[1.2] mb-6 md:mb-8">
                  {Array.isArray(overlayLines) && overlayLines.length > 0
                    ? overlayLines
                        .slice(0, 4)
                        .map((item: any, idx: number) => <div key={idx}>{item?.line}</div>)
                    : overlayText}
                </div>
                {enableLink && link && (
                  <div className="flex items-center gap-2 text-base md:text-lg lg:text-xl xl:text-2xl">
                    <CMSLink {...link} className="text-white hover:text-gray-200 underline" />
                    <MoveRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {enableLink &&
            link &&
            !(overlayText || (Array.isArray(overlayLines) && overlayLines.length > 0)) && (
              <div className="absolute bottom-4 right-4">
                <CMSLink {...link} />
              </div>
            )}
        </div>
      )}
    </div>
  )
}

const MobileMediaColumn: React.FC<{
  content: any
  headline?: string
  isFirst?: boolean
}> = ({ content, headline, isFirst = false }) => {
  const { media, overlayText, overlayLines, enableLink, link, autoPlay, controls } = content || {}
  const isVideo = !!media?.mimeType?.startsWith?.('video/')

  return (
    <div className={`relative w-full lg:hidden ${isFirst ? '' : 'mt-0'}`}>
      {((Array.isArray(overlayLines) && overlayLines.length > 0) || overlayText) && (
        <div className="px-4 py-6">
          <div className="text-left text-black">
            <div className="pr-2 text-2xl md:text-3xl font-normal capitalize text-black leading-tight">
              {Array.isArray(overlayLines) && overlayLines.length > 0
                ? overlayLines
                    .slice(0, 4)
                    .map((item: any, idx: number) => <div key={idx}>{item?.line}</div>)
                : overlayText}
            </div>
            {enableLink && link && (
              <div className="pt-2">
                <CMSLink {...link} className="text-black underline" />
              </div>
            )}
          </div>
        </div>
      )}
      {media && (
        <div className={`relative w-full ${isVideo ? 'aspect-video' : 'aspect-square'}`}>
          <Media
            resource={media}
            imgClassName="w-full h-full object-cover"
            videoClassName="w-full h-full object-cover"
            fill
            autoPlay={Boolean(autoPlay)}
            controls={Boolean(controls)}
          />
          {headline && (
            <div className="absolute bottom-4 left-0">
              <div className="bg-white px-4 py-1 rounded-r-full">
                <p className="text-sm font-normal text-gray-900 capitalize tracking-wide">
                  {headline}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MobileTextColumn: React.FC<{ content: any; isLast?: boolean }> = ({ content, isLast }) => {
  const { title, bodyText, enableLink, link } = content || {}

  return (
    <div className={`bg-white px-4 py-8 ${isLast ? 'pb-6' : 'pb-16'} lg:hidden`}>
      <div className="flex flex-col space-y-4">
        {title && (
          <h2 className="pr-2 text-2xl md:text-3xl font-normal capitalize text-black leading-tight">
            {title}
          </h2>
        )}
        {bodyText && (
          <div className="pr-2 text-base text-black leading-relaxed ">
            <RichText data={bodyText} className="text-black" enableGutter={false} />
          </div>
        )}
        {enableLink && link && (
          <div className="pt-2 flex items-center gap-2">
            <CMSLink {...link} className="text-black hover:text-primary-hover underline" />
            <MoveRight className="w-5 text-black h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 font-light" />
          </div>
        )}
      </div>
    </div>
  )
}

const ColumnContent: React.FC<{ column: any }> = ({ column }) => {
  if (!column) return null
  const { type, text, media } = column
  if (type === 'text' && text) return <TextColumn content={text} />
  if (type === 'media' && media) return <MediaColumn content={media} />
  return null
}

/* ------------------------ sticky row ------------------------ */

const StickyRow: React.FC<{
  row: any
  index: number
  totalRows: number
  /** px step between stacked sticky tops */
  offsetStep?: number
  /** base z-index to avoid layout clashes */
  zBase?: number
}> = ({ row, index, totalRows, offsetStep = 0, zBase = 1 }) => {
  // Responsive header heights: py-6 md:py-8 lg:py-10 + logo heights + padding
  // Mobile: py-6 (24px) + logo ~48px + padding = ~72px
  // Tablet: py-8 (32px) + logo ~64px + padding = ~96px
  // Desktop: py-10 (40px) + logo ~80px + padding = ~120px
  const baseTop = useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 120 // lg and up
      if (window.innerWidth >= 768) return 96 // md to lg
      return 0 // mobile - no header gap
    }
    return 0 // default for SSR - no header gap
  }, [])

  const top = useMemo(() => baseTop + index * offsetStep, [baseTop, index, offsetStep])
  // later rows on top of earlier rows
  const zIndex = useMemo(() => zBase + index, [zBase, index])

  const { left, right } = row || {}

  return (
    <article className="sticky " style={{ top, zIndex, position: 'sticky' }}>
      <div
        className={`relative bg-white ${left?.type === 'media' && right?.type === 'media' ? 'lg:min-h-[80vh]' : 'lg:min-h-[80vh]'}`}
      >
        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-2 items-stretch lg:min-h-[80vh] min-h-[100vh] relative z-10">
          <div className="order-2 lg:order-1 h-full">
            <ColumnContent column={left} />
          </div>
          <div className="order-1 lg:order-2 h-full">
            <ColumnContent column={right} />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          {left?.type === 'media' && right?.type === 'text' ? (
            <>
              <MobileMediaColumn content={left.media} headline={right.text?.headline} isFirst />
              <MobileTextColumn content={right.text} isLast={index === totalRows - 1} />
            </>
          ) : right?.type === 'media' && left?.type === 'text' ? (
            <>
              <MobileMediaColumn content={right.media} headline={left.text?.headline} isFirst />
              <MobileTextColumn content={left.text} isLast={index === totalRows - 1} />
            </>
          ) : left?.type === 'media' && right?.type === 'media' ? (
            <>
              <MobileMediaColumn content={left.media} isFirst />
            </>
          ) : (
            <div className="grid grid-cols-1 items-stretch">
              <ColumnContent column={left} />
              <ColumnContent column={right} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ------------------------ exported block ------------------------ */

export const TwoColumnRowBlock: React.FC<TwoColumnRowBlockProps> = ({ rows }) => {
  if (!rows || rows.length === 0) return null

  // tune these to your layout
  const STICKY_STEP = 0 // no step gap between rows
  const Z_BASE = 1 // bump if something else has high z-layers

  return (
    <section className="relative bg-gray-100">
      <div className="w-full">
        {/* Full-page mode: let the window scroll; no overflow containers here */}
        {rows.map((row, rowIndex) => (
          <StickyRow
            key={rowIndex}
            row={row}
            index={rowIndex}
            totalRows={rows.length}
            offsetStep={STICKY_STEP}
            zBase={Z_BASE}
          />
        ))}
      </div>
    </section>
  )
}
