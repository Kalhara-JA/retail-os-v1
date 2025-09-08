'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface PhoneButtonProps {
  phoneNumber: string
  enabled?: boolean
  position?: 'bottom-right' | 'bottom-left'
  size?: 'small' | 'medium' | 'large'
  tooltipText?: string
}

export const PhoneButton: React.FC<PhoneButtonProps> = ({
  phoneNumber,
  enabled = true,
  position = 'bottom-right',
  size = 'medium',
  tooltipText = 'Call us now',
}) => {
  if (!enabled) return null

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    return phone.replace(/\D/g, '')
  }

  const generatePhoneURL = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber)
    return `tel:${formattedPhone}`
  }

  const sizeClasses = {
    small: 'w-10 h-10 sm:w-11 sm:h-11',
    medium: 'w-11 h-11 sm:w-13 sm:h-13',
    large: 'w-13 h-13 sm:w-15 sm:h-15',
  }

  // Position classes are not used since we have custom positioning to avoid overlap
  // const positionClasses = {
  //   'bottom-right': 'bottom-6 right-6',
  //   'bottom-left': 'bottom-6 left-6',
  // }

  const iconSizes = {
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-5 h-5 sm:w-6 sm:h-6',
    large: 'w-6 h-6 sm:w-7 sm:h-7',
  }

  // Adjust position for phone button to not overlap with WhatsApp button
  const adjustedPosition =
    position === 'bottom-right' ? 'bottom-20 right-2 sm:right-6' : 'bottom-20 left-2 sm:left-6'

  return (
    <motion.a
      href={generatePhoneURL()}
      className={`fixed z-50 ${adjustedPosition} ${sizeClasses[size]} bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Phone Icon */}
      <svg
        className={`${iconSizes[size]} text-white`}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {tooltipText}
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
    </motion.a>
  )
}
