import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { EmailForm } from './EmailForm'
import { SocialIcons } from './SocialIcons'
import { Media } from '@/components/Media'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const footer = footerData as any

  const {
    backgroundImage,
    headline = 'Stop Managing Tech.',
    headlineHighlight = 'Start Growing',
    headlineEnd = 'Your Retail Business.',
    subheadline = "We'll Show You How RetailOs Helps You Move Faster, Simplify Operations, And Sell Smarter Starting Today",
    emailPlaceholder = 'Enter your email...',
    buttonText = 'Book a demo >',
    contactInfo = 'Prefer To Talk Now? Call Us +972-54-586-3718',
    socialMedia = [],
    legalLinks = [
      { text: 'Terms of Service', url: '/terms' },
      { text: 'Privacy Policy', url: '/privacy' },
    ],
    copyright = 'RetailOs. All rights reserved.',
  } = footer || {}

  // Split first sentence for exact heading treatment
  const stopManaging = (headline as string).replace(/\.$/, '')

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Background image if provided */}
        {backgroundImage && (
          <div className="absolute inset-0">
            <Media
              resource={backgroundImage}
              imgClassName="w-full h-full object-cover opacity-20"
              alt="Footer background"
            />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="text-left space-y-6 sm:space-y-8 w-full sm:w-11/12 md:w-11/12 lg:w-11/12">
              {/* Headline */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="font-bold tracking-tight text-balance leading-[1.1] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  <span className="block text-white">{stopManaging}</span>
                  <span className="block">
                    <span className="text-primary">{headlineHighlight}</span>
                    <span className="text-white"> {headlineEnd}</span>
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed max-w-2xl">
                  {subheadline}
                </p>
              </div>

              {/* Email Form */}
              <div className="flex justify-start">
                <EmailForm
                  placeholder={emailPlaceholder || 'Enter your email...'}
                  buttonText={buttonText || 'Book a demo >'}
                />
              </div>

              {/* Contact Info */}
              <p className="text-sm sm:text-base md:text-lg text-white/85">{contactInfo}</p>

              {/* Social Icons */}
              <div className="flex justify-start">
                <SocialIcons socialMedia={socialMedia || []} />
              </div>
            </div>

            {/* Right Side - Visual Element (can be used for additional content or kept empty) */}
            <div className="hidden lg:block">
              {/* This space can be used for additional visual elements if needed */}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Legal Links - Left Side */}
            <div className="flex items-center gap-6 order-1">
              {legalLinks?.map((link: any, idx: number) => (
                <Link
                  key={idx}
                  href={link?.url || '#'}
                  className="text-sm text-white/75 hover:text-white transition-colors"
                >
                  {link?.text || 'Link'}
                </Link>
              ))}
            </div>

            {/* Copyright - Right Side */}
            <div className="order-2 text-sm text-white/60 whitespace-nowrap">{copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
