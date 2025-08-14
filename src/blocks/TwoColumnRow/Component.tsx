'use client'

import { cn } from '@/utilities/ui'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RichText from '@/components/RichText'

import type { TwoColumnRowBlock as TwoColumnRowBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

const TextColumn: React.FC<{
  content: any
}> = ({ content }) => {
  const { headline, title, bodyText, enableLink, link } = content

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

const MediaColumn: React.FC<{
  content: any
}> = ({ content }) => {
  const { media, overlayText, enableLink, link } = content

  return (
    <div className="relative h-full w-full">
      {media && (
        <div className="relative h-full w-full">
          <Media resource={media} imgClassName="w-full h-full object-cover rounded-lg" fill />

          {overlayText && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
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

const ColumnContent: React.FC<{
  column: any
}> = ({ column }) => {
  const { type, text, media } = column

  if (type === 'text' && text) {
    return <TextColumn content={text} />
  }

  if (type === 'media' && media) {
    return <MediaColumn content={media} />
  }

  return null
}

const StickyRow: React.FC<{
  row: any
  index: number
  totalRows: number
}> = ({ row, index, totalRows }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Calculate the progress for this specific row
  const rowProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Transform values for the sticky effect
  const y = useTransform(
    rowProgress,
    [0, 0.3, 0.7, 1],
    [100, 0, 0, -50], // Slide up from bottom, stick, then move up slightly
  )

  const opacity = useTransform(
    rowProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0], // Fade in, stay visible, fade out
  )

  const scale = useTransform(
    rowProgress,
    [0, 0.1, 0.9, 1],
    [0.98, 1, 1, 0.98], // Subtle scale effect
  )

  // Parallax effect for background elements
  const backgroundY = useTransform(
    rowProgress,
    [0, 1],
    [20, -20], // Subtle parallax movement
  )

  const { left, right } = row

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-[85vh] overflow-hidden"
      style={{
        y,
        opacity,
        scale,
      }}
    >
      {/* Background parallax effect */}
      <motion.div className="absolute inset-0 opacity-5" style={{ y: backgroundY }}>
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[85vh] relative z-10">
        <motion.div
          className="order-2 lg:order-1 h-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ColumnContent column={left} />
        </motion.div>

        <motion.div
          className="order-1 lg:order-2 h-full"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ColumnContent column={right} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export const TwoColumnRowBlock: React.FC<TwoColumnRowBlockProps> = (props) => {
  const { rows } = props

  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <div className="relative bg-gray-100">
      <div className="space-y-0">
        {rows.map((row, rowIndex) => (
          <StickyRow key={rowIndex} row={row} index={rowIndex} totalRows={rows.length} />
        ))}
      </div>
    </div>
  )
}
