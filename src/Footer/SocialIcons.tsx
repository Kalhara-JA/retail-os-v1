'use client'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import React from 'react'

interface SocialMediaItem {
  platform: string
  url: string
}
interface SocialIconsProps {
  socialMedia: SocialMediaItem[]
}

// Custom TikTok Icon Component
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export const SocialIcons: React.FC<SocialIconsProps> = ({ socialMedia }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="h-6 w-6 hover:text-primary transition-colors" />
      case 'linkedin':
        return <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
      case 'instagram':
        return <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
      case 'facebook':
        return <Facebook className="h-6 w-6 hover:text-primary transition-colors" />
      case 'tiktok':
        return <TikTokIcon className="h-6 w-6 hover:text-primary transition-colors" />
      default:
        return null
    }
  }

  return (
    <div className="flex gap-6">
      {socialMedia.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/85 hover:text-primary transition-colors"
          aria-label={`Visit our ${item.platform} page`}
        >
          {getIcon(item.platform)}
        </a>
      ))}
    </div>
  )
}
