import { ArrowUpRightIcon } from 'lucide-react'
import { HREF_PREFIX } from '@/constants'
import { cn } from '@/utils/styles'
import { inter, plusJakartaSans } from '@/fonts'
import { ResourceImage } from '@/components/resource-image'
import { FavoriteButton } from '@/components/favorite-button'
import type { FavoriteTranslations, ResourceTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

type SpecialCardProps = {
  resource: {
    id: string
    name: string
    url: string
    brief: string
    category?: string
    image: string
    placeholder: string
    order: number
  }
  isFavorite: boolean
  locale: Locale
  resourceTranslations: ResourceTranslations
  favoriteTranslations: FavoriteTranslations
}

export function SpecialCard({
  resource,
  isFavorite,
  locale,
  resourceTranslations,
  favoriteTranslations
}: SpecialCardProps) {
  const { id, name, url, brief, category, image, placeholder, order } = resource

  return (
    <article
      className='relative rounded-lg 
        shadow-xs 
        transition-colors 
        duration-300 
        ease-in-out 
        bg-linear-to-br 
        bg-light-600/20 
        dark:from-neutral-950 
        dark:to-stone-900 
        border 
        border-light-600/70 
        dark:border-orange-300/10 
        dark:hover:border-orange-300/50 p-2.5 grid grid-rows-subgrid row-span-2 gap-3'
    >
      <div className='flex flex-col gap-3'>
        <ResourceImage
          src={image}
          title={name}
          placeholder={placeholder}
          order={order}
          screenshotTemplate={resourceTranslations.screenshot}
        />
        <div className='flex flex-col gap-1.5'>
          <div className='flex justify-between items-center'>
            <h2 className={cn(plusJakartaSans.className, 'font-semibold text-balance')}>{name}</h2>
            {category ? (
              <span className='text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>
                {category}
              </span>
            ) : null}
          </div>
          <p className={cn(inter.className, 'text-sm text-gray-700 dark:text-link text-pretty')}>
            {brief}
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
          <ArrowUpRightIcon className='size-4 duration-200 group-hover:translate-x-[1.5px] group-hover:opacity-100' />
        </a>
        <div className='flex gap-1.5'>
          <FavoriteButton
            id={id}
            isFavorite={isFavorite}
            locale={locale}
            translations={favoriteTranslations}
            addLabel={resourceTranslations.favoriteAdd}
            removeLabel={resourceTranslations.favoriteRemove}
            iconClassName='transition-all duration-200'
          />
        </div>
      </div>
    </article>
  )
}
