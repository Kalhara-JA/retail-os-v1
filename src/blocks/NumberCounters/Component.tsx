'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { NumberCountersBlock as NumberCountersBlockType } from '@/payload-types'
import { NumberTicker } from '@/components/ui/number-ticker'

// Helper function to get display value and animation settings
const getCounterDisplay = (counter: NumberCountersBlockType['counters'][0]) => {
  const {
    valueType,
    singleValue,
    rangeStart,
    rangeEnd,
    percentageValue,
    percentageRangeStart,
    percentageRangeEnd,
    isPercentage,
    label,
    animationStartValue,
    direction,
    delay,
    decimalPlaces,
  } = counter

  switch (valueType) {
    case 'single':
      return {
        displayValue: singleValue?.toString() || '0',
        numericValue: singleValue || 0,
        isAnimated: true,
        isPercentage: isPercentage || false,
        animationStartValue: animationStartValue ?? 0,
        direction: (direction as 'up' | 'down') ?? 'up',
        delay: delay ?? 0,
        decimalPlaces: decimalPlaces ?? 0,
      }

    case 'range':
      return {
        displayValue: `${rangeStart || 0}-${rangeEnd || 0}`,
        numericValue: null,
        isAnimated: true,
        isPercentage: isPercentage || false,
        animationStartValue: 0,
        direction: (direction as 'up' | 'down') ?? 'up',
        delay: delay ?? 0,
        decimalPlaces: 0,
      }

    case 'percentage':
      return {
        displayValue: percentageValue?.toString() || '0',
        numericValue: percentageValue || 0,
        isAnimated: true,
        isPercentage: true,
        animationStartValue: animationStartValue ?? 0,
        direction: (direction as 'up' | 'down') ?? 'up',
        delay: delay ?? 0,
        decimalPlaces: decimalPlaces ?? 0,
      }

    case 'percentageRange':
      return {
        displayValue: `${percentageRangeStart || 0}-${percentageRangeEnd || 0}`,
        numericValue: null,
        isAnimated: true,
        isPercentage: true,
        animationStartValue: 0,
        direction: (direction as 'up' | 'down') ?? 'up',
        delay: delay ?? 0,
        decimalPlaces: 0,
      }

    default:
      return {
        displayValue: '0',
        numericValue: 0,
        isAnimated: true,
        isPercentage: false,
        animationStartValue: 0,
        direction: 'up' as const,
        delay: 0,
        decimalPlaces: 0,
      }
  }
}

// Individual Counter Component
const formatLabelTwoLines = (label?: string | null, l1?: string | null, l2?: string | null) => {
  const line1 = (l1 || '').trim()
  const line2 = (l2 || '').trim()
  if (line1 || line2) return `${line1}\n${line2}`.trim()
  const text = String(label ?? '').trim()
  if (!text) return ''
  const words = text.split(/\s+/)
  if (words.length <= 1) return text
  const mid = Math.floor(words.length / 2)
  return `${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`
}
const Counter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
  isVisible: boolean
}> = ({ counter, isVisible }) => {
  const labelText = formatLabelTwoLines(
    (counter as any).label,
    (counter as any).labelLine1,
    (counter as any).labelLine2,
  )
  const {
    displayValue,
    numericValue,
    isAnimated,
    isPercentage,
    animationStartValue,
    direction,
    delay,
    decimalPlaces,
  } = getCounterDisplay(counter)

  return (
    <div className="flex flex-col items-center text-center">
      {/* Number Display */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center">
        {isAnimated && numericValue !== null && isVisible ? (
          // For single numbers, use the NumberTicker animation
          <div className="flex items-center">
            <NumberTicker
              value={numericValue}
              startValue={animationStartValue}
              direction={direction}
              delay={delay}
              decimalPlaces={decimalPlaces}
              className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]"
            />
            {isPercentage && (
              <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
                %
              </span>
            )}
          </div>
        ) : (
          // For ranges and percentages, show the full text without animation
          <div className="flex items-center">
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              {displayValue}
            </span>
            {isPercentage && (
              <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
                %
              </span>
            )}
          </div>
        )}
      </div>

      {/* Label */}
      <p className="whitespace-pre-line text-sm md:text-lg lg:text-xl xl:text-3xl max-w-sm text-white font-normal text-center capitalize leading-[20px] md:leading-[24px] lg:leading-[28px] xl:leading-[39px] font-roboto">
        {labelText}
      </p>
    </div>
  )
}

// Range Counter Component - creates separate counters for start and end values
const RangeCounter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
  isVisible: boolean
}> = ({ counter, isVisible }) => {
  const { rangeStart, rangeEnd, isPercentage, delay = 0 } = counter
  const labelText = formatLabelTwoLines(
    (counter as any).label,
    (counter as any).labelLine1,
    (counter as any).labelLine2,
  )

  return (
    <div className="flex flex-col items-center text-center">
      {/* Range Display */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2">
        {/* Start Value */}
        <div className="flex items-center">
          {isVisible ? (
            <NumberTicker
              value={rangeStart || 0}
              startValue={0}
              direction="up"
              delay={delay || 0}
              decimalPlaces={0}
              className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]"
            />
          ) : (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              0
            </span>
          )}
          {isPercentage && (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              %
            </span>
          )}
        </div>

        {/* Separator */}
        <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
          -
        </span>

        {/* End Value */}
        <div className="flex items-center">
          {isVisible ? (
            <NumberTicker
              value={rangeEnd || 0}
              startValue={0}
              direction="up"
              delay={(delay || 0) + 0.5}
              decimalPlaces={0}
              className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]"
            />
          ) : (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              0
            </span>
          )}
          {isPercentage && (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              %
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="whitespace-pre-line text-sm md:text-lg lg:text-xl xl:text-3xl text-white font-normal text-center capitalize leading-[20px] md:leading-[24px] lg:leading-[28px] xl:leading-[39px] font-roboto max-w-sm">
        {labelText}
      </p>
    </div>
  )
}

// Percentage Range Counter Component
const PercentageRangeCounter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
  isVisible: boolean
}> = ({ counter, isVisible }) => {
  const { percentageRangeStart, percentageRangeEnd, delay = 0 } = counter
  const labelText = formatLabelTwoLines(
    (counter as any).label,
    (counter as any).labelLine1,
    (counter as any).labelLine2,
  )

  return (
    <div className="flex flex-col items-center text-center">
      {/* Range Display */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2">
        {/* Start Value */}
        <div className="flex items-center">
          {isVisible ? (
            <NumberTicker
              value={percentageRangeStart || 0}
              startValue={0}
              direction="up"
              delay={delay || 0}
              decimalPlaces={0}
              className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]"
            />
          ) : (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              0
            </span>
          )}
          <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
            %
          </span>
        </div>

        {/* Separator */}
        <span className="font-almoni text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-normal text-white">
          -
        </span>

        {/* End Value */}
        <div className="flex items-center">
          {isVisible ? (
            <NumberTicker
              value={percentageRangeEnd || 0}
              startValue={0}
              direction="up"
              delay={(delay || 0) + 0.5}
              decimalPlaces={0}
              className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]"
            />
          ) : (
            <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
              0
            </span>
          )}
          <span className="font-almoni text-5xl md:text-5xl lg:text-[80px] xl:text-[80px] 2xl:text-[80px] font-normal text-white ml-1 lg:leading-[67.551px] xl:leading-[67.551px] 2xl:leading-[67.551px]">
            %
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="whitespace-pre-line text-sm md:text-lg lg:text-xl xl:text-3xl text-white font-normal text-center capitalize leading-[20px] md:leading-[24px] lg:leading-[28px] xl:leading-[39px] font-roboto max-w-sm">
        {labelText}
      </p>
    </div>
  )
}

// Main Component
export const NumberCountersBlock: React.FC<NumberCountersBlockType> = ({
  title,
  description,
  counters,
  layout = 'grid',
  backgroundColor = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once triggered, we can disconnect the observer
          observer.disconnect()
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the section is fully in view
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!counters || counters.length === 0) {
    return null
  }

  // Get background classes based on theme
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'light':
        return 'bg-white text-black'
      case 'transparent':
        return 'bg-transparent text-white'
      case 'dark':
      default:
        return 'bg-black text-white'
    }
  }

  // Get layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'row':
        return 'grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-6 md:gap-8 lg:gap-12'
      case 'column':
        return 'flex flex-col space-y-16 sm:space-y-8 md:space-y-12'
      case 'grid':
      default:
        return 'grid grid-cols-2 gap-12 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16'
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`py-12 sm:py-16 md:py-12 px-4 sm:px-6 md:px-16 ${getBackgroundClasses()}`}
    >
      <div className="px-4 md:px-1 lg:px-16">
        {/* Header */}
        {(title || description) && (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 sm:mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-sm sm:text-base md:text-lg opacity-80 max-w-2xl sm:max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Counters Grid */}
        <div className={getLayoutClasses()}>
          {counters.map((counter, index) => {
            switch (counter.valueType) {
              case 'range':
                return <RangeCounter key={index} counter={counter} isVisible={isVisible} />
              case 'percentageRange':
                return (
                  <PercentageRangeCounter key={index} counter={counter} isVisible={isVisible} />
                )
              default:
                return <Counter key={index} counter={counter} isVisible={isVisible} />
            }
          })}
        </div>
      </div>
    </section>
  )
}
