import { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { listFavorites } from '@/actions/favorites'
import { Container } from '@/components/container'
import { SearchResults, SearchResultsSkeleton } from '@/components/search-results'
import { searchResourcesText } from '@/services/text-search'
import {
  MAX_SEARCH_QUERY_LENGTH,
  MIN_SEARCH_QUERY_LENGTH,
  isValidSearchQuery,
  normalizeSearchQuery
} from '@/utils/search'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { formatMessage } from '@/i18n/messages'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'

export const maxDuration = 60

type SearchPageProps = {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({
  params,
  searchParams
}: SearchPageProps): Promise<Metadata> {
  const [{ locale: localeParam }, { q = '' }] = await Promise.all([params, searchParams])
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)
  const query = normalizeSearchQuery(q)
  const pathname = getLocalizedHref('/search', locale)

  return {
    title: query
      ? formatMessage(dictionary.metadata.searchTitle, { query })
      : dictionary.metadata.search,
    alternates: getAlternateUrls(pathname, locale),
    robots: {
      index: false,
      follow: true
    }
  }
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const [{ locale: localeParam }, { q }] = await Promise.all([params, searchParams])
  if (!isLocale(localeParam)) return null

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)

  if (typeof q !== 'string' || normalizeSearchQuery(q).length === 0) {
    redirect(getLocalizedHref('/', locale))
  }

  const query = normalizeSearchQuery(q)

  if (!isValidSearchQuery(query)) {
    return (
      <Container>
        <section className='mx-auto max-w-xl px-4 py-24 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            {dictionary.search.invalid.title}
          </h1>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>
            {formatMessage(dictionary.search.invalid.description, {
              min: MIN_SEARCH_QUERY_LENGTH,
              max: MAX_SEARCH_QUERY_LENGTH
            })}
          </p>
        </section>
      </Container>
    )
  }

  const searchPromise = searchResourcesText(query)
  const favoritesPromise = listFavorites()

  return (
    <Container>
      <Suspense
        key={query}
        fallback={<SearchResultsSkeleton />}
      >
        <SearchResults
          query={query}
          searchPromise={searchPromise}
          favoritesPromise={favoritesPromise}
          locale={locale}
        />
      </Suspense>
    </Container>
  )
}
