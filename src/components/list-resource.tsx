import { ArrowUpRight } from 'lucide-react'

import { CatalogResource } from '@/types/catalog'

import { inter, plusJakartaSans } from '@/fonts'

import { HREF_PREFIX } from '@/constants'
import { cn } from '@/utils/styles'
import { CollectionBookmarkButton } from '@/components/collection-bookmark-button'
import { NoResultsSearch } from '@/components/empty-state'
import { ResourceImage } from '@/components/resource-image'
import type {
  CollectionsTranslations,
  NoResultsTranslations,
  ResourceTranslations
} from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

type ResourceItemProps = {
  id: string
  title: string
  url: string
  summary?: string
  brief: string | null
  image: string
  order: number
  placeholder: string | null
  resourceTranslations: ResourceTranslations
  collectionTranslations: CollectionsTranslations
}

export function ResourceItem({
  id,
  title,
  url,
  summary,
  brief,
  image,
  order,
  placeholder,
  resourceTranslations,
  collectionTranslations
}: ResourceItemProps) {
  return (
    <article className='relative rounded-lg shadow-xs border transition-colors duration-300 ease-in-out resource-item grid grid-rows-subgrid row-span-2 gap-3 p-2.5 border-light-600/70 bg-light-600/20 hover:bg-light-600/70 dark:border-neutral-800/70 dark:bg-[#101010] dark:hover:bg-[#191919]'>
      <div className='flex flex-col gap-3'>
        <ResourceImage
          src={image}
          title={title}
          placeholder={placeholder}
          order={order}
          screenshotTemplate={resourceTranslations.screenshot}
        />
        <div className='flex flex-col gap-1.5'>
          <h2
            className={cn(
              plusJakartaSans.className,
              'text-base font-bold leading-5 tracking-tight text-balance text-neutral-950 dark:text-white'
            )}
          >
            {title}
          </h2>
          <p className={cn(inter.className, 'text-sm text-gray-700 dark:text-link text-pretty')}>
            {brief || summary}
          </p>
        </div>
      </div>
      <div className='flex justify-between'>
        <a
          className='group flex gap-1 items-center text-xs text-blue-700 dark:text-anchor transition-colors duration-300 ease-in-out resource-item hover:underline underline-offset-2'
          href={`${HREF_PREFIX}${url}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <span className={inter.className}>{resourceTranslations.goTo}</span>
          <ArrowUpRight className='size-4 duration-200 group-hover:translate-x-[1.5px] group-hover:opacity-100' />
        </a>
        <div className='flex gap-1.5'>
          <CollectionBookmarkButton
            resourceId={id}
            title={title}
            translations={collectionTranslations}
          />
        </div>
      </div>
    </article>
  )
}

type ListResourceProps = {
  data: CatalogResource[]
  locale: Locale
  resourceTranslations: ResourceTranslations
  collectionTranslations: CollectionsTranslations
  noResultsTranslations: NoResultsTranslations
}

export function ListResource({
  data,
  locale,
  resourceTranslations,
  collectionTranslations,
  noResultsTranslations
}: ListResourceProps) {
  return (
    <>
      {data && data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
          {data.map(({ id, title, url, image, placeholder, brief }, index) => {
            return (
              <ResourceItem
                order={index}
                key={id}
                title={title}
                url={url}
                brief={brief}
                image={image}
                placeholder={placeholder}
                id={id}
                resourceTranslations={resourceTranslations}
                collectionTranslations={collectionTranslations}
              />
            )
          })}
        </div>
      ) : (
        <NoResultsSearch
          locale={locale}
          translations={noResultsTranslations}
        />
      )}
    </>
  )
}
