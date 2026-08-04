import { search } from '@/services/search'
import { listFavorites } from '@/actions/favorites'
import { ErrorState } from '@/components/error-state'
import { PanelResources } from '@/components/panel-resources'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

type HomeProps = {
  query?: string
  locale: Locale
  slug?: string
  subcategory?: string
}

export async function Home({ locale, query, slug, subcategory }: HomeProps) {
  const [data, dictionary] = await Promise.all([
    search({
      q: query,
      slug,
      subcategory
    }),
    getDictionary(locale)
  ])
  // @ts-ignore
  const { resources, error } = data
  if (error) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }
  const favoritesIds = await listFavorites()

  return (
    <PanelResources
      resources={resources}
      favoritesIds={favoritesIds}
      slug={slug}
      subcategory={subcategory}
      locale={locale}
      resourceTranslations={dictionary.resources}
      favoriteTranslations={dictionary.favorites.errors}
      noResultsTranslations={dictionary.search.databaseEmpty}
    />
  )
}
