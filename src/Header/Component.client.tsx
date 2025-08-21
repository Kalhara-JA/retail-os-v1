'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
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
          isScrolled
            ? 'bg-black/95 backdrop-blur-sm shadow-lg'
            : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'
        }`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between py-6 md:py-8 lg:py-10">
            {/* Left side: Logo + Navigation */}
            <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Logo
                    loading="eager"
                    priority="high"
                    logoConfig={data?.logo}
                    responsiveWidth="w-[120px] md:w-[160px] lg:w-[200px]"
                  />
                </Link>
              </div>

              {/* Navigation - Left side next to logo */}
              <div className="hidden xl:block">
                <HeaderNav data={data} />
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden xl:flex flex-shrink-0">
              <HeaderActions data={data} />
            </div>

            {/* Mobile Actions */}
            <div className="xl:hidden flex items-center gap-4">
              {/* Book a Demo Button */}
              {data?.demoButton && (
                <button
                  className="text-white hover:text-gray-300 underline underline-offset-4 hover:no-underline transition-all duration-200 text-base md:text-lg font-light"
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
                className="text-white hover:text-gray-300 hover:bg-white/10 h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 p-0 [&_svg]:h-8 [&_svg]:w-8"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu />
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
