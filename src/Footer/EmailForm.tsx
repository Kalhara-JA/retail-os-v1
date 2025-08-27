'use client'
import React, { useState } from 'react'
import { isValidEmail, sanitizeEmail } from '../utilities/email'

interface EmailFormProps {
  placeholder: string
  buttonText: string
}

export const EmailForm: React.FC<EmailFormProps> = ({ placeholder, buttonText }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedEmail = sanitizeEmail(email)

    if (!isValidEmail(sanitizedEmail)) {
      setMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizedEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Thank you! We'll be in touch soon.")
        setEmail('')
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="group flex items-center gap-1.5 sm:gap-3 rounded-2xl sm:rounded-2xl border border-black bg-white p-1.5 sm:p-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md sm:rounded-2xl bg-white px-3 sm:px-5 py-2 sm:py-4 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative rounded-xl sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 text-sm sm:text-base font-medium text-white transition-transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed bg-primary hover:bg-primary-hover shadow-[0_4px_12px_rgba(16,133,175,0.4)] sm:shadow-[0_6px_20px_rgba(16,133,175,0.45)] ring-1 ring-white/30"
        >
          {isSubmitting ? 'Sending...' : buttonText}
          <span className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-2xl ring-1 ring-white/30" />
        </button>
      </form>
      {message && <p className="mt-1.5 sm:mt-3 text-xs md:text-base text-white/80">{message}</p>}
    </div>
  )
}
