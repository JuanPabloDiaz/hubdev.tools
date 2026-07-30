'use client'

import { ArrowUpRight, HeartIcon } from 'lucide-react'

import { Resource } from '@/types/resource'

import { inter, plusJakartaSans } from '@/fonts'

import { HREF_PREFIX } from '@/constants'
import { cn } from '@/utils/styles'
import { useFavorite } from '@/hooks/useFavorite'
import { NoResultsSearch } from '@/components/empty-state'
import { ResourceImage } from '@/components/resource-image'

type ResourceItemProps = {
  id: string
  title: string
  url: string
  summary: string
  brief: string | null
  image: string
  order: number
  placeholder: string | null
  isFavorite: boolean
  rankPosition?: number
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
  isFavorite,
  rankPosition
}: ResourceItemProps) {
  const { handleToggleFavorite, isFav } = useFavorite(isFavorite, id)
  const ranking =
    rankPosition && rankPosition <= 3
      ? {
          label: rankPosition === 1 ? '#1 Top match' : `#${rankPosition}`,
          styles: {
            1: 'border-amber-300/70 bg-amber-200 text-amber-950 dark:border-amber-400/45 dark:bg-amber-950/85 dark:text-amber-200',
            2: 'border-sky-300/70 bg-sky-100 text-sky-950 dark:border-cyan-400/40 dark:bg-cyan-950/80 dark:text-cyan-200',
            3: 'border-violet-300/70 bg-violet-100 text-violet-950 dark:border-fuchsia-400/40 dark:bg-fuchsia-950/75 dark:text-fuchsia-200'
          }[rankPosition]
        }
      : undefined

  return (
    <article
      id={rankPosition ? `resource-${rankPosition}` : undefined}
      className={cn(
        'relative rounded-lg shadow-xs border transition-colors duration-300 ease-in-out resource-item grid grid-rows-subgrid row-span-2 gap-3 p-2.5 border-light-600/70 bg-light-600/20 hover:bg-light-600/70 dark:border-neutral-800/70 dark:bg-[#101010] dark:hover:bg-[#191919]',
        rankPosition === 1 && 'border-amber-400/50 dark:border-amber-400/35',
        rankPosition === 2 && 'border-sky-400/40 dark:border-cyan-400/30',
        rankPosition === 3 && 'border-violet-400/40 dark:border-fuchsia-400/30'
      )}
    >
      {ranking && (
        <span
          className={cn(
            'absolute left-4 top-4 z-10 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm',
            ranking.styles
          )}
        >
          {ranking.label}
        </span>
      )}
      <div className='flex flex-col gap-3'>
        <ResourceImage
          src={image}
          title={title}
          placeholder={placeholder}
          order={order}
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
            {brief ?? summary}
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
          <span className={inter.className}>Go to resource</span>
          <ArrowUpRight className='size-4 duration-200 group-hover:translate-x-[1.5px] group-hover:opacity-100' />
        </a>
        <div className='flex gap-1.5'>
          <div
            className='cursor-pointer'
            onClick={handleToggleFavorite}
          >
            <HeartIcon
              className={cn(
                'size-4 mr-2 hover:scale-110 text-light-800 dark:text-red-400',
                isFav && 'fill-light-800 dark:fill-red-400'
              )}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

type ListResourceProps = {
  data: Resource[]
  favoritesIds: string[]
}

export function ListResource({ data, favoritesIds }: ListResourceProps) {
  // Convert to Set for O(1) lookups instead of O(n) includes()
  const favoritesIdsSet = new Set(favoritesIds)

  return (
    <>
      {data && data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
          {data.map(({ id, title, url, summary, image, placeholder, brief }, index) => {
            return (
              <ResourceItem
                order={index}
                key={id}
                title={title}
                url={url}
                summary={summary}
                brief={brief}
                image={image}
                placeholder={placeholder}
                id={id}
                isFavorite={favoritesIdsSet.has(id)}
              />
            )
          })}
        </div>
      ) : (
        <NoResultsSearch />
      )}
    </>
  )
}
