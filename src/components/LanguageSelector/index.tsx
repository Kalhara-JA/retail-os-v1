'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Globe2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  show?: boolean
  icon?: any
  size?: 'small' | 'medium' | 'large'
  className?: string
}

type LangOpt = { value: string; label: string }

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  show = true,
  icon,
  size = 'medium',
  className,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [langs, setLangs] = useState<LangOpt[]>([])
  const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false)
  const initOnce = useRef(false)
  const pollTimer = useRef<number | null>(null)

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 p-1.5 md:p-2'
      case 'large':
        return 'h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 p-2.5 md:p-3'
      default:
        return 'h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 p-2 md:p-2.5'
    }
  }

  useEffect(() => {
    if (initOnce.current) return
    initOnce.current = true

    // 1) Global init callback (Google calls this after loading)
    ;(window as any).googleTranslateElementInit = () => {
      // Important: host must be renderable; don't use display:none
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en', // change to your source language
          autoDisplay: false,
        },
        'google_translate_element_host',
      )
      setIsGoogleTranslateLoaded(true)
    }

    // 2) Inject script if needed
    const hasScript = Array.from(document.scripts).some((s) =>
      s.src.includes('translate_a/element.js'),
    )
    if (!hasScript) {
      const script = document.createElement('script')
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    } else if ((window as any).google?.translate?.TranslateElement) {
      // Script already present and ready → init ourselves
      ;(window as any).googleTranslateElementInit()
    }

    // 3) Poll for the hidden select and harvest languages
    const startPolling = () => {
      const tick = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
        if (select && select.options.length > 1) {
          const list: LangOpt[] = Array.from(select.options)
            .filter((o) => o.value) // skip placeholder
            .map((o) => ({ value: o.value, label: o.textContent || o.value }))
          setLangs(list)
          if (pollTimer.current) window.clearInterval(pollTimer.current)
          pollTimer.current = null
        }
      }
      // poll every 250ms (up to ~12s)
      let count = 0
      pollTimer.current = window.setInterval(() => {
        tick()
        if (++count > 48 && pollTimer.current) {
          window.clearInterval(pollTimer.current)
          pollTimer.current = null
        }
      }, 250)
    }

    // Try to start polling immediately; if init runs later, the poll will still catch it
    startPolling()

    return () => {
      if (pollTimer.current) {
        window.clearInterval(pollTimer.current)
        pollTimer.current = null
      }
      // Do NOT remove the script here; other parts of the app might rely on it
    }
  }, [])

  // Listen for language changes from Google Translate
  useEffect(() => {
    if (isGoogleTranslateLoaded) {
      const handleLanguageChange = () => {
        // Check if page has been translated
        const body = document.body
        if (
          body.classList.contains('translated-ltr') ||
          body.classList.contains('translated-rtl')
        ) {
          // Try to detect current language from Google Translate
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
          if (select && select.value && select.value !== 'en') {
            setCurrentLanguage(select.value)
          }
        } else {
          setCurrentLanguage('en')
        }
      }

      // Listen for DOM changes that might indicate translation
      const observer = new MutationObserver(handleLanguageChange)
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: false,
      })

      return () => observer.disconnect()
    }
  }, [isGoogleTranslateLoaded])

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang)

    if (lang === 'en') {
      // Reset to original language
      if ((window as any).google?.translate?.TranslateElement) {
        ;(window as any).google.translate.TranslateElement.getInstance().restore()
      }
    } else {
      // Hook into Google Translate's hidden select element
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.value = lang
        select.dispatchEvent(new Event('change'))
      }
    }
  }

  if (!show) return null

  return (
    <div className={cn('relative', className)}>
      {/* Off-screen host for Google widget (don't use display:none) */}
      <div
        id="google_translate_element_host"
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          height: 0,
          width: 0,
          overflow: 'hidden',
        }}
      />

      {/* Hide Google's banner/frame if it appears */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame { display: none !important; }
            .goog-logo-link, .goog-te-gadget span { display: none !important; }
            body { top: 0 !important; }
          `,
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'text-white hover:text-primary-hover hover:bg-white/10',
              getButtonSizeClasses(),
            )}
          >
            {icon ? (
              <Media
                resource={icon}
                className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 object-contain"
              />
            ) : (
              <Globe2 className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            )}
            <span className="sr-only">Language Selector</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-black border-gray-700 text-white">
          <div className="p-2">
            <div className="text-sm text-gray-400 mb-2 px-2">Select Language</div>
            {langs.length > 0 ? (
              langs.map((language) => (
                <DropdownMenuItem
                  key={language.value}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-800 rounded-md transition-colors',
                    currentLanguage === language.value && 'bg-gray-800',
                  )}
                  onClick={() => changeLanguage(language.value)}
                >
                  <span className="flex-1">{language.label}</span>
                  {currentLanguage === language.value && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="text-gray-400 text-sm px-2 py-2 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading languages...
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
