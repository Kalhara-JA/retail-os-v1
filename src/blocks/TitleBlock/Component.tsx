import React from 'react'

import type { TitleBlock as TitleBlockProps } from '@/payload-types'

export const TitleBlock: React.FC<TitleBlockProps> = ({ title1, title2, title3 }) => {
  const titles = [title1, title2, title3].filter(Boolean)

  const renderTitle = (title: string, index: number) => {
    const titleText = String(title ?? '')
    const hasFullStops = titleText.includes('.')
    const sentences = hasFullStops
      ? (titleText.match(/[^.]+(?:\.)?/g) || []).map((s) => s)
      : [titleText]

    return (
      <h2
        key={`title-${index}`}
        className={`text-black border-0 outline-none font-normal capitalize font-['Roboto'] text-[28px] leading-[38px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[58px] lg:text-[64px] lg:leading-[76px] xl:text-[72px] xl:leading-[86px] 2xl:text-[82px] 2xl:leading-[96px]`}
      >
        {hasFullStops
          ? sentences.map((sentence, sentenceIndex) => (
              <React.Fragment key={`sentence-${index}-${sentenceIndex}`}>
                <span className="whitespace-nowrap">{sentence.trim()}</span>
                {sentenceIndex < sentences.length - 1 ? (
                  <>
                    {' '}
                    <wbr />
                  </>
                ) : null}
              </React.Fragment>
            ))
          : title}
      </h2>
    )
  }

  return (
    <div className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-0 bg-white  w-full border-0 outline-none">
      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12">
        {titles.map((title, index) => (
          <div key={`title-container-${index}`} className={index > 0 ? 'mt-4' : ''}>
            {renderTitle(title!, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
