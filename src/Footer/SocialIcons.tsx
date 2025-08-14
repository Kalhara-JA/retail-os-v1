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

export const SocialIcons: React.FC<SocialIconsProps> = ({ socialMedia }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return (
          <Youtube className="h-6 w-6 hover:text-primary transition-colors"  />
        )
      case 'linkedin':
        return (
          <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
        )
      case 'instagram':
        return (
          <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
        )
      case 'facebook':
        return (
          <Facebook className="h-6 w-6 hover:text-primary transition-colors" />
        )
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
