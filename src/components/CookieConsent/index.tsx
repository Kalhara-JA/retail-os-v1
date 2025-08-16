'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CookieConsentProps {
  enabled?: boolean
  title?: string
  message?: string
  acceptText?: string
  declineText?: string
  learnMoreText?: string
  learnMoreUrl?: string
  position?: 'bottom' | 'top'
  theme?: 'light' | 'dark'
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  enabled = true,
  title = 'We use cookies',
  message = 'We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
  acceptText = 'Accept',
  declineText = 'Decline',
  learnMoreText = 'Learn more',
  learnMoreUrl = '/privacy-policy',
  position = 'bottom',
  theme = 'light',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsAccepted(cookieConsent === 'accepted')
    }
  }, [enabled])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsAccepted(true)
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsAccepted(false)
    setIsVisible(false)
  }

  const handleClose = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsAccepted(false)
    setIsVisible(false)
  }

  if (!enabled || isAccepted) return null

  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        link: 'text-blue-600 hover:text-blue-700',
      },
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
        link: 'text-blue-400 hover:text-blue-300',
      },
    },
  }

  const currentTheme = themeClasses[theme]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed z-50 left-0 right-0 ${
            position === 'bottom' ? 'bottom-0' : 'top-0'
          } ${currentTheme.bg} ${currentTheme.border} border-t shadow-lg`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{title}</h3>
                <p className={`text-sm ${currentTheme.text} opacity-90`}>
                  {message}
                  {learnMoreUrl && (
                    <a
                      href={learnMoreUrl}
                      className={`ml-1 underline ${currentTheme.button.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {learnMoreText}
                    </a>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentTheme.button.secondary}`}
                >
                  {declineText}
                </button>
                <button
                  onClick={handleAccept}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentTheme.button.primary}`}
                >
                  {acceptText}
                </button>
                <button
                  onClick={handleClose}
                  className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${currentTheme.text}`}
                  aria-label="Close cookie consent"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
