'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { HeaderNav, HeaderActions } from './Nav'
import { MobileMenu } from './Nav/MobileMenu'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9997] text-white transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left side: Logo + Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Logo loading="eager" priority="high" logoConfig={data?.logo} />
                </Link>
              </div>

              {/* Navigation - Left side next to logo */}
              <div className="hidden md:block">
                <HeaderNav data={data} />
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex flex-shrink-0">
              <HeaderActions data={data} />
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4">
              {/* Book a Demo Button */}
              {data?.demoButton && (
                <button
                  className="text-white hover:text-gray-300 underline underline-offset-4 hover:no-underline transition-all duration-200 text-sm font-medium"
                  onClick={() => {
                    if (data.demoButton?.link?.type === 'custom' && data.demoButton.link.url) {
                      if (data.demoButton.link.newTab) {
                        window.open(data.demoButton.link.url, '_blank')
                      } else {
                        window.location.href = data.demoButton.link.url
                      }
                    }
                  }}
                >
                  {data.demoButton.text || 'Book a Demo'}
                </button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-300 hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        data={data}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
