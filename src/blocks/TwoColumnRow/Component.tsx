'use client'

import React, { useMemo } from 'react'
import RichText from '@/components/RichText'
import type { TwoColumnRowBlock as TwoColumnRowBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

/* ------------------------ columns ------------------------ */

const TextColumn: React.FC<{ content: any }> = ({ content }) => {
  const { headline, title, bodyText, enableLink, link } = content || {}

  return (
    <div className="bg-gray-100 h-full flex items-center">
      <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12 lg:py-16 flex flex-col space-y-6">
        {headline && (
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{headline}</p>
        )}
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h2>
        )}
        {bodyText && (
          <div className="text-lg text-black leading-relaxed">
            <RichText data={bodyText} className="text-black" enableGutter={false} />
          </div>
        )}
        {enableLink && link && (
          <div className="pt-4 text-black hover:underline transition-all duration-300">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </div>
  )
}

const MediaColumn: React.FC<{ content: any }> = ({ content }) => {
  const { media, overlayText, enableLink, link } = content || {}

  return (
    <div className="relative h-full w-full">
      {media && (
        <div className="relative h-full w-full">
          <Media resource={media} imgClassName="w-full h-full object-cover" fill />
          {overlayText && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{overlayText}</h3>
                {enableLink && link && <CMSLink {...link} />}
              </div>
            </div>
          )}
          {enableLink && link && !overlayText && (
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
  const { media, overlayText, enableLink, link } = content || {}

  return (
    <div className={`relative w-full aspect-square lg:hidden ${isFirst ? '' : 'mt-0'}`}>
      {media && (
        <div className="relative w-full h-full">
          <Media resource={media} imgClassName="w-full h-full object-cover" fill />
          {headline && (
            <div className="absolute bottom-4 left-0">
              <div className="bg-white px-4 py-2 rounded-r-full">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  {headline}
                </p>
              </div>
            </div>
          )}
          {overlayText && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{overlayText}</h3>
                {enableLink && link && <CMSLink {...link} />}
              </div>
            </div>
          )}
          {enableLink && link && !overlayText && (
            <div className="absolute bottom-4 right-4">
              <CMSLink {...link} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MobileTextColumn: React.FC<{ content: any }> = ({ content }) => {
  const { title, bodyText, enableLink, link } = content || {}

  return (
    <div className="bg-white px-4 py-8 lg:hidden">
      <div className="flex flex-col space-y-4">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h2>
        )}
        {bodyText && (
          <div className="text-base text-gray-700 leading-relaxed">
            <RichText data={bodyText} className="text-gray-700" enableGutter={false} />
          </div>
        )}
        {enableLink && link && (
          <div className="pt-2">
            <CMSLink {...link} className="text-primary hover:text-primary-hover underline" />
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
  /** base sticky top in px (use your fixed header height here, if any) */
  baseTop?: number
  /** base z-index to avoid layout clashes */
  zBase?: number
}> = ({ row, index, totalRows, offsetStep = 12, baseTop = 0, zBase = 1 }) => {
  const top = useMemo(() => baseTop + index * offsetStep, [baseTop, index, offsetStep])
  // later rows on top of earlier rows
  const zIndex = useMemo(() => zBase + index, [zBase, index])

  const { left, right } = row || {}

  return (
    <article className="sticky " style={{ top, zIndex, position: 'sticky' }}>
      <div className="relative h-[90vh] bg-white">
        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-2 items-stretch h-[90vh] relative z-10">
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
              <MobileTextColumn content={right.text} />
            </>
          ) : right?.type === 'media' && left?.type === 'text' ? (
            <>
              <MobileMediaColumn content={right.media} headline={left.text?.headline} isFirst />
              <MobileTextColumn content={left.text} />
            </>
          ) : left?.type === 'media' && right?.type === 'media' ? (
            <>
              <MobileMediaColumn content={left.media} isFirst />
              <MobileMediaColumn content={right.media} />
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
  const STICKY_BASE = 0 // set to your fixed header height (e.g., 64) if you have one
  const STICKY_STEP = 12 // px between stacked tops
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
            baseTop={STICKY_BASE}
            zBase={Z_BASE}
          />
        ))}
      </div>
    </section>
  )
}
