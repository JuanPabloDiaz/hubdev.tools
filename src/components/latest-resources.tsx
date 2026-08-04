import { Suspense } from 'react'

import { getLatestResources } from '@/services/dashboard'
import { listFavorites } from '@/actions/favorites'
import { ErrorState } from '@/components/error-state'
import { LoadingResources } from '@/components/loading'
import { SpecialCard } from '@/components/special-card'
import type { Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'

async function ListLatestResources({
  locale,
  dictionary
}: {
  locale: Locale
  dictionary: Dictionary
}) {
  const [data, favoriteIds] = await Promise.all([getLatestResources(), listFavorites()])

  if (!data) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  // Convert to Set for O(1) lookups instead of O(n) includes()
  const favoriteIdsSet = new Set(favoriteIds)
  const favoriteTranslations = dictionary.favorites.errors

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
      {data.map(({ id, title, url, image, brief, placeholder, summary }, index) => (
        <SpecialCard
          key={id}
          resource={{
            id,
            name: title,
            brief: brief ?? summary,
            url,
            image,
            placeholder: placeholder ?? '',
            order: index,
            clicks: 0
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

export async function LatestResources({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale)
  return (
    <section>
      <div className='flex flex-col gap-2 mt-8'>
        <h2 className='text-2xl text-balance font-semibold text-light-800 dark:text-primary'>
          {dictionary.dashboard.latest}
        </h2>
        <p className='text-sm text-pretty max-w-lg text-muted-foreground'>
          {dictionary.dashboard.latestDescription}
        </p>
      </div>
      <Suspense fallback={<LoadingResources />}>
        <ListLatestResources
          locale={locale}
          dictionary={dictionary}
        />
      </Suspense>
    </section>
  )
}
