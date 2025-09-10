'use client'

import { AnimatePresence, motion, MotionProps } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
  /** If true, tapping/clicking toggles pause/resume. */
  pauseOnInteraction?: boolean
  /** Auto-resume after this many ms when paused by interaction. Default: 10000 */
  autoResumeMs?: number
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  className,
  pauseOnInteraction = false,
  autoResumeMs = 10000,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearIntervalSafe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const clearResumeTimeoutSafe = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  const startInterval = useCallback(() => {
    clearIntervalSafe()
    intervalRef.current = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)
  }, [duration, words.length])

  useEffect(() => {
    if (!isPaused) {
      startInterval()
    } else {
      clearIntervalSafe()
    }
    return () => {
      clearIntervalSafe()
    }
  }, [isPaused, startInterval])

  useEffect(() => {
    return () => {
      clearIntervalSafe()
      clearResumeTimeoutSafe()
    }
  }, [])

  const togglePause = useCallback(() => {
    if (!pauseOnInteraction) return
    // If currently paused, resume immediately and cancel auto-resume
    if (isPaused) {
      clearResumeTimeoutSafe()
      setIsPaused(false)
      return
    }
    // Otherwise pause and schedule auto-resume
    setIsPaused(true)
    clearResumeTimeoutSafe()
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, autoResumeMs)
  }, [autoResumeMs, isPaused, pauseOnInteraction])

  return (
    <div
      className={cn(
        'overflow-hidden py-2',
        pauseOnInteraction ? 'cursor-pointer select-none' : undefined,
      )}
      onPointerDown={pauseOnInteraction ? togglePause : undefined}
      role={pauseOnInteraction ? 'button' : undefined}
      aria-pressed={pauseOnInteraction ? isPaused : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.h1 key={words[index]} className={cn(className)} {...motionProps}>
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}
