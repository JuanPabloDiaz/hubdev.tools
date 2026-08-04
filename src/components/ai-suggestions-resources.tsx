import { Suspense } from 'react'

import { getAISuggestions } from '@/services/dashboard'
import { listFavorites } from '@/actions/favorites'
import { ErrorState } from '@/components/error-state'
import { LoadingResources } from '@/components/loading'
import { SpecialCard } from '@/components/special-card'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

async function ListAISuggestions({ locale }: { locale: Locale }) {
  const [aiSuggestions, favoriteIds, dictionary] = await Promise.all([
    getAISuggestions(),
    listFavorites(),
    getDictionary(locale)
  ])
  const { data, error } = aiSuggestions

  if (error || !data) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  if (data.length === 0) {
    return null
  }

  // Convert to Set for O(1) lookups instead of O(n) includes()
  const favoriteIdsSet = new Set(favoriteIds)
  const favoriteTranslations = dictionary.favorites.errors

  return (
    <section>
      <div className='flex flex-col gap-2 mt-8'>
        <h2 className='text-2xl text-balance font-semibold text-light-800 dark:text-primary'>
          {dictionary.dashboard.aiSuggestions}
        </h2>
        <p className='text-sm text-pretty max-w-lg text-muted-foreground'>
          {dictionary.dashboard.aiSuggestionsDescription}
        </p>
      </div>
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
    </section>
  )
}

export function AISuggestionsResources({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<LoadingResources />}>
      <ListAISuggestions locale={locale} />
    </Suspense>
  )
}
