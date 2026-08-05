import { Suspense } from 'react'
import { InfoIcon } from 'lucide-react'

import { getFeaturedResourcesCached } from '@/services/cached-queries'
import { listFavorites } from '@/actions/favorites'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LoadingResources } from '@/components/loading'
import { ErrorState } from '@/components/error-state'
import { SpecialCard } from '@/components/special-card'
import type { Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'

export async function ListFeaturedResources({
  locale,
  dictionary
}: {
  locale: Locale
  dictionary: Dictionary
}) {
  const [data, favoriteIds] = await Promise.all([
    getFeaturedResourcesCached(locale),
    listFavorites()
  ])

  if (!data) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  const favoriteIdsSet = new Set(favoriteIds)
  const favoriteTranslations = dictionary.favorites.errors

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
      {data.map(({ id, title, url, image, brief, placeholder, clicks }, index) => (
        <SpecialCard
          key={id}
          resource={{
            id,
            name: title,
            brief: brief ?? '',
            url,
            image,
            placeholder: placeholder ?? '',
            order: index,
            clicks
          }}
          isFavorite={favoriteIdsSet.has(id)}
          locale={locale}
          resourceTranslations={dictionary.resources}
          favoriteTranslations={favoriteTranslations}
        />
      ))}
    </div>
  )
}

export async function FeaturedResources({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale)

  return (
    <section>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl text-balance font-semibold text-light-800 dark:text-primary'>
            {dictionary.dashboard.featured}
          </h2>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='text-muted-foreground hover:text-foreground transition-colors'>
                  <InfoIcon className='size-3' />
                  <span className='sr-only'>{dictionary.dashboard.featuredInformation}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='right'
                className='max-w-[220px] text-center'
              >
                <p>{dictionary.dashboard.featuredTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className='text-sm text-pretty max-w-lg text-muted-foreground'>
          {dictionary.dashboard.featuredDescription}
        </p>
      </div>
      <Suspense fallback={<LoadingResources />}>
        <ListFeaturedResources
          locale={locale}
          dictionary={dictionary}
        />
      </Suspense>
    </section>
  )
}
