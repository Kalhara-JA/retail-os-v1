import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const handleSmoothScroll: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const targetHref = href || ''
    if (!targetHref) return
    try {
      if (targetHref.startsWith('#')) {
        e.preventDefault()
        const id = targetHref.slice(1)
        const el = document.getElementById(id)
        if (el) {
          const header = document.querySelector('header') as HTMLElement | null
          const offset = header?.offsetHeight ?? 0
          const top = el.getBoundingClientRect().top + window.scrollY - offset
          window.history.pushState(null, '', `#${id}`)
          window.scrollTo({ top, behavior: 'smooth' })
        }
        return
      }

      if (targetHref.includes('#') && typeof window !== 'undefined') {
        const [path, hash] = targetHref.split('#')
        if (path === window.location.pathname) {
          e.preventDefault()
          const id = hash
          const el = document.getElementById(id)
          if (el) {
            const header = document.querySelector('header') as HTMLElement | null
            const offset = header?.offsetHeight ?? 0
            const top = el.getBoundingClientRect().top + window.scrollY - offset
            window.history.pushState(null, '', `#${id}`)
            window.scrollTo({ top, behavior: 'smooth' })
          }
        }
      }
    } catch {
      // no-op
    }
  }

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link
        className={cn(className)}
        href={href || url || ''}
        {...newTabProps}
        onClick={handleSmoothScroll}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }
  return (
    <Button asChild className={className} size={sizeFromProps} variant={appearance}>
      <Link
        className={cn(className)}
        href={href || url || ''}
        {...newTabProps}
        onClick={handleSmoothScroll}
      >
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
