'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import type { Header as HeaderType } from '@/payload-types'

interface MobileMenuProps {
  data: HeaderType
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, isOpen, onClose }) => {
  const navItems = data?.navItems || []
  const demoButton = data?.demoButton
  const showLanguageSelector = data?.showLanguageSelector ?? true
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set())

  const handleDropdownToggle = (index: number) => {
    const newOpenDropdowns = new Set(openDropdowns)
    if (newOpenDropdowns.has(index)) {
      newOpenDropdowns.delete(index)
    } else {
      newOpenDropdowns.add(index)
    }
    setOpenDropdowns(newOpenDropdowns)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] md:hidden">
      <Card className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-gray-700 shadow-xl rounded-none">
        <CardHeader className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-gray-300 hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {navItems.map((navItem, i) => {
            const { link, hasDropdown, dropdownItems } = navItem

            if (hasDropdown && dropdownItems) {
              return (
                <Collapsible
                  key={i}
                  open={openDropdowns.has(i)}
                  onOpenChange={() => handleDropdownToggle(i)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-between w-full text-white hover:text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      {link.label}
                      {openDropdowns.has(i) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 space-y-2 mt-2">
                    {dropdownItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2">
                        <h4 className="text-gray-300 font-medium">{item.title}</h4>
                        <div className="ml-4 space-y-1">
                          {item.items?.map((subItem, subIndex) => (
                            <CMSLink
                              key={subIndex}
                              {...subItem.link}
                              appearance="link"
                              className="block text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
                            >
                              <div className="space-y-1">
                                {subItem.description && (
                                  <div className="text-sm text-gray-500">{subItem.description}</div>
                                )}
                              </div>
                            </CMSLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <CMSLink
                key={i}
                {...link}
                appearance="link"
                className="block text-white hover:text-gray-300 transition-colors py-2"
              />
            )
          })}

          <div className="pt-4 border-t border-gray-700 space-y-4">
            {showLanguageSelector && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-300 hover:bg-white/10"
              >
                <Globe2 className="h-5 w-5" />
                <span className="sr-only">Language Selector</span>
              </Button>
            )}

            {demoButton && (
              <Button
                className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium"
                onClick={() => {
                  if (demoButton.link?.type === 'custom' && demoButton.link.url) {
                    if (demoButton.link.newTab) {
                      window.open(demoButton.link.url, '_blank')
                    } else {
                      window.location.href = demoButton.link.url
                    }
                  }
                }}
              >
                {demoButton.text || 'Book a Demo'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
