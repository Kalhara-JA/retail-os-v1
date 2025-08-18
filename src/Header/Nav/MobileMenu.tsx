'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetOverlay } from '@/components/ui/sheet'

import type { Header as HeaderType } from '@/payload-types'

interface MobileMenuProps {
  data: HeaderType
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, isOpen, onClose }) => {
  const navItems = data?.navItems || []
  const demoButton = data?.demoButton
  const showLanguageSelector = data?.languageSelector?.show ?? true
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetOverlay className="z-[9998]" />
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[400px] bg-black border-gray-700 p-0 z-[9999]"
        style={{ zIndex: 9999 }}
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-700">
          <SheetTitle className="text-white font-semibold text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-2">
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
                        className="flex items-center justify-between w-full text-white hover:text-gray-300 hover:bg-white/10 transition-colors h-auto p-3"
                      >
                        <span className="text-left">{link.label}</span>
                        {openDropdowns.has(i) ? (
                          <ChevronUp className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 space-y-2 mt-2 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden transition-all duration-300 ease-in-out">
                      {dropdownItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="space-y-2">
                          <h4 className="text-gray-300 font-medium text-sm">{item.title}</h4>
                          <div className="ml-4 space-y-1">
                            {item.items?.map((subItem, subIndex) => (
                              <div key={subIndex} onClick={onClose} className="group">
                                <div className="p-2 rounded hover:bg-gray-800 transition-colors">
                                  <CMSLink
                                    {...subItem.link}
                                    appearance="link"
                                    className="block text-gray-400 group-hover:text-white transition-colors text-sm"
                                  >
                                    <div className="space-y-1">
                                      {subItem.description && (
                                        <div className="text-xs text-gray-500 group-hover:text-gray-300">
                                          {subItem.description}
                                        </div>
                                      )}
                                    </div>
                                  </CMSLink>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              }

              return (
                <div key={i} onClick={onClose}>
                  <CMSLink
                    {...link}
                    appearance="link"
                    className="block text-white hover:text-gray-300 transition-colors py-3 px-3 rounded hover:bg-white/10"
                  />
                </div>
              )
            })}
          </div>

          <div className="px-6 py-4 border-t border-gray-700 space-y-4">
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
                className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => {
                  if (demoButton.link?.type === 'custom' && demoButton.link.url) {
                    if (demoButton.link.newTab) {
                      window.open(demoButton.link.url, '_blank')
                    } else {
                      window.location.href = demoButton.link.url
                    }
                  }
                  onClose()
                }}
              >
                {demoButton.text || 'Book a Demo'}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
