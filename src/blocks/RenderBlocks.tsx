import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TitleBlock } from '@/blocks/TitleBlock/Component'
import { TwoColumnRowBlock } from '@/blocks/TwoColumnRow/Component'
import { HorizontalScrollCardsBlock } from '@/blocks/HorizontalScrollFramer/Component'
import { RetailerShowcaseBlock } from '@/blocks/RetailerShowcase/Component'
import { NumberCountersBlock } from '@/blocks/NumberCounters/Component'
import { FeatureShowcaseBlock } from '@/blocks/FeatureShowcase/Component'
import { LogoMarqueeBlock } from '@/blocks/LogoMarquee/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  titleBlock: TitleBlock,
  twoColumnRow: TwoColumnRowBlock,
  horizontalScrollCards: HorizontalScrollCardsBlock,
  retailerShowcase: RetailerShowcaseBlock,
  numberCounters: NumberCountersBlock,
  featureShowcase: FeatureShowcaseBlock,
  logoMarquee: LogoMarqueeBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const htmlId = (block as any)?.htmlId as string | undefined
              return (
                <div className="border-0 outline-none" id={htmlId || undefined} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
