'use client'
import React, { useState } from 'react'

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
    if (!email) return
    setIsSubmitting(true)
    setMessage('')
    try {
      await new Promise((r) => setTimeout(r, 900))
      setMessage("Thank you! We'll be in touch soon.")
      setEmail('')
    } catch (e) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="group flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-white/15 bg-white/5 p-1 sm:p-1.5 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md sm:rounded-lg bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative rounded-md sm:rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed bg-primary hover:bg-primary-hover shadow-[0_4px_12px_rgba(16,133,175,0.4)] sm:shadow-[0_6px_20px_rgba(16,133,175,0.45)] ring-1 ring-white/30"
        >
          {isSubmitting ? 'Sending...' : buttonText}
          <span className="pointer-events-none absolute inset-0 rounded-md sm:rounded-lg ring-1 ring-white/30" />
        </button>
      </form>
      {message && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/80">{message}</p>}
    </div>
  )
}
