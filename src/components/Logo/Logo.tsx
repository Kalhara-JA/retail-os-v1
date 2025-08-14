import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {/* Logo Symbol - Multi-colored interlocking shapes */}
      <div className="relative w-8 h-8">
        {/* Red shape */}
        <div className="absolute inset-0 bg-red-500 rounded-full transform rotate-45 scale-75"></div>
        {/* Yellow shape */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full transform -rotate-45 scale-75"></div>
        {/* Blue shape */}
        <div className="absolute inset-0 bg-primary rounded-full transform rotate-0 scale-75"></div>
      </div>

      {/* Logo Text */}
      <span className="text-xl font-bold text-white">RetailOs</span>
    </div>
  )
}
