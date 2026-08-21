import Image from 'next/image'

import { DEFAULT_BLUR_DATA_URL } from '@/constants'
import { formatMessage } from '@/i18n/messages'

type ResourceImageProps = {
  src: string
  title: string
  placeholder?: string | null
  order: number
  screenshotTemplate: string
}

export function ResourceImage({
  src,
  title,
  placeholder,
  order,
  screenshotTemplate
}: ResourceImageProps) {
  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-md border bg-neutral-100 dark:bg-neutral-950'>
      <Image
        loading={order < 4 ? 'eager' : 'lazy'}
        src={src}
        fill
        fetchPriority={order === 0 ? 'high' : undefined}
        alt={formatMessage(screenshotTemplate, { title })}
        className='object-cover object-center'
        decoding='async'
        placeholder='blur'
        blurDataURL={placeholder || DEFAULT_BLUR_DATA_URL}
        sizes='(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw'
      />
    </div>
  )
}
