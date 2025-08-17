import React from 'react'

import type { TitleBlock as TitleBlockProps } from '@/payload-types'

export const TitleBlock: React.FC<TitleBlockProps> = ({ title }) => {
  return (
    <div className="py-8 md:py-12 lg:py-16 px-4 md:px-8 lg:px-16 xl:px-24 mx-0 bg-white  w-full border-0 outline-none">
      <div className="max-w-7xl mx-auto">
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12">
          <h2 className="text-3xl md:text-4xl text-black lg:text-5xl font-bold leading-tight border-0 outline-none">
            {title}
          </h2>
        </div>
      </div>
    </div>
  )
}
