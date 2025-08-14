'use client'

import React from 'react'
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
        isAnimated: false,
        isPercentage: isPercentage || false,
        animationStartValue: 0,
        direction: 'up' as const,
        delay: 0,
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
        isAnimated: false,
        isPercentage: true,
        animationStartValue: 0,
        direction: 'up' as const,
        delay: 0,
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
const Counter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
}> = ({ counter }) => {
  const { label } = counter
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
        {isAnimated && numericValue !== null ? (
          // For single numbers, use the NumberTicker animation
          <div className="flex items-center">
            <NumberTicker
              value={numericValue}
              startValue={animationStartValue}
              direction={direction}
              delay={delay}
              decimalPlaces={decimalPlaces}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
            />
            {isPercentage && (
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
                %
              </span>
            )}
          </div>
        ) : (
          // For ranges and percentages, show the full text without animation
          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
              {displayValue}
            </span>
            {isPercentage && (
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
                %
              </span>
            )}
          </div>
        )}
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-[150px] sm:max-w-[200px]">
        {label}
      </p>
    </div>
  )
}

// Range Counter Component - creates separate counters for start and end values
const RangeCounter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
}> = ({ counter }) => {
  const { label, rangeStart, rangeEnd, isPercentage } = counter

  return (
    <div className="flex flex-col items-center text-center">
      {/* Range Display */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2">
        {/* Start Value */}
        <div className="flex items-center">
          <NumberTicker
            value={rangeStart || 0}
            startValue={0}
            direction="up"
            delay={0}
            decimalPlaces={0}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
          />
          {isPercentage && (
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
              %
            </span>
          )}
        </div>

        {/* Separator */}
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
          -
        </span>

        {/* End Value */}
        <div className="flex items-center">
          <NumberTicker
            value={rangeEnd || 0}
            startValue={0}
            direction="up"
            delay={0.5}
            decimalPlaces={0}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
          />
          {isPercentage && (
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
              %
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-[150px] sm:max-w-[200px]">
        {label}
      </p>
    </div>
  )
}

// Percentage Range Counter Component
const PercentageRangeCounter: React.FC<{
  counter: NumberCountersBlockType['counters'][0]
}> = ({ counter }) => {
  const { label, percentageRangeStart, percentageRangeEnd } = counter

  return (
    <div className="flex flex-col items-center text-center">
      {/* Range Display */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2">
        {/* Start Value */}
        <div className="flex items-center">
          <NumberTicker
            value={percentageRangeStart || 0}
            startValue={0}
            direction="up"
            delay={0}
            decimalPlaces={0}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
          />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
            %
          </span>
        </div>

        {/* Separator */}
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
          -
        </span>

        {/* End Value */}
        <div className="flex items-center">
          <NumberTicker
            value={percentageRangeEnd || 0}
            startValue={0}
            direction="up"
            delay={0.5}
            decimalPlaces={0}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
          />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white ml-1">
            %
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-[150px] sm:max-w-[200px]">
        {label}
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
        return 'grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12'
      case 'column':
        return 'flex flex-col space-y-6 sm:space-y-8 md:space-y-12'
      case 'grid':
      default:
        return 'grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16'
    }
  }

  return (
    <section className={`py-12 sm:py-16 md:py-20 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{title}</h2>
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
                return <RangeCounter key={index} counter={counter} />
              case 'percentageRange':
                return <PercentageRangeCounter key={index} counter={counter} />
              default:
                return <Counter key={index} counter={counter} />
            }
          })}
        </div>
      </div>
    </section>
  )
}
