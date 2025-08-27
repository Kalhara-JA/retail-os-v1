'use client'

import React from 'react'
import { Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { HelpCircle, BookOpen, Briefcase, TrendingUp, Target, Users } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

interface DropdownItem {
  title: string
  icon?: 'none' | 'help' | 'topics' | 'tools' | 'business' | 'marketing' | 'growth' | null
  items?: Array<{
    link: {
      type?: 'reference' | 'custom' | null
      newTab?: boolean | null
      reference?:
        | ({
            relationTo: 'pages'
            value: number | any
          } | null)
        | ({
            relationTo: 'posts'
            value: number | any
          } | null)
      url?: string | null
      label: string
    }
    description?: string | null
    id?: string | null
  }> | null
  id?: string | null
}

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'help':
      return <HelpCircle className="h-5 w-5" />
    case 'topics':
      return <BookOpen className="h-5 w-5" />
    case 'tools':
      return <Briefcase className="h-5 w-5" />
    case 'business':
      return <Users className="h-5 w-5" />
    case 'marketing':
      return <Target className="h-5 w-5" />
    case 'growth':
      return <TrendingUp className="h-5 w-5" />
    default:
      return null
  }
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <NavigationMenu className="max-w-none">
      <NavigationMenuList className="gap-6 xl:gap-[38px]">
        {navItems.map((navItem, i) => {
          const { link, hasDropdown, dropdownItems } = navItem

          if (hasDropdown && dropdownItems && dropdownItems.length > 0) {
            return (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-primary-hover hover:bg-white/10 border-none data-[state=open]:bg-white/10 data-[state=open]:text-primary-hover text-sm md:text-base lg:text-lg font-light xl:font-normal xl:text-white xl:text-[20px] xl:leading-[15.717px] xl:text-center xl:font-['Roboto']">
                  {link.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-screen max-w-6xl bg-black border border-gray-700 rounded-lg shadow-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {dropdownItems.map((item, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center gap-3">
                            {item.icon && item.icon !== 'none' && (
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-sm">
                                {getIcon(item.icon)}
                              </div>
                            )}
                            <h3 className="text-white font-semibold text-xl">{item.title}</h3>
                          </div>

                          <div className="space-y-3">
                            {item.items && item.items.length > 0 ? (
                              item.items.map((subItem, subIndex) => (
                                <div key={subIndex} className="group">
                                  <div className="p-3 rounded-lg hover:bg-gray-800 transition-all duration-200">
                                    <NavigationMenuLink asChild>
                                      <CMSLink
                                        {...subItem.link}
                                        appearance="link"
                                        className="block transition-all duration-200 text-base"
                                      >
                                        <div className="space-y-1">
                                          {subItem.description && (
                                            <div className="text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                                              {subItem.description}
                                            </div>
                                          )}
                                        </div>
                                      </CMSLink>
                                    </NavigationMenuLink>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-400 text-base p-3">No items available</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={i}>
              <NavigationMenuLink asChild>
                <CMSLink
                  {...link}
                  appearance="link"
                  className="text-white hover:text-primary-hover transition-colors text-sm md:text-base lg:text-lg font-light xl:font-normal xl:text-white xl:text-[20px] xl:leading-[15.717px] xl:text-center xl:font-['Roboto']"
                />
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// Separate component for right-side elements
export const HeaderActions: React.FC<{ data: HeaderType }> = ({ data }) => {
  const demoButton = data?.demoButton
  const languageSelector = data?.languageSelector
  const showLanguageSelector = languageSelector?.show ?? true
  const customIcon = languageSelector?.icon
  const buttonSize = languageSelector?.size || 'medium'

  const getButtonSizeClasses = () => {
    switch (buttonSize) {
      case 'small':
        return 'h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 p-1.5 md:p-2'
      case 'large':
        return 'h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 p-2.5 md:p-3'
      default:
        return 'h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 p-2 md:p-2.5'
    }
  }

  return (
    <div className="flex items-center gap-4">
      {showLanguageSelector && (
        <Button
          variant="ghost"
          size="icon"
          className={`text-white hover:text-primary-hover hover:bg-white/10 ${getButtonSizeClasses()}`}
        >
          {customIcon ? (
            <Media
              resource={customIcon}
              className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 object-contain"
            />
          ) : (
            <Globe2 className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          )}
          <span className="sr-only">Language Selector</span>
        </Button>
      )}

      {demoButton && (
        <Button
          className="bg-primary hover:bg-primary-hover text-white px-8 py-2.5 md:px-10 md:py-3 lg:px-12 lg:py-4 rounded-full font-light text-base md:text-lg lg:text-xl"
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
  )
}
