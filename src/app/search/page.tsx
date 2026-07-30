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

export const maxDuration = 60

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q = '' } = await searchParams
  const query = normalizeSearchQuery(q)

  return {
    title: query ? `Search: ${query}` : 'Search',
    alternates: {
      canonical: '/search'
    },
    robots: {
      index: false,
      follow: true
    }
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  if (typeof q !== 'string' || normalizeSearchQuery(q).length === 0) {
    redirect('/')
  }

  const query = normalizeSearchQuery(q)

  if (!isValidSearchQuery(query)) {
    return (
      <Container>
        <section className='mx-auto max-w-xl px-4 py-24 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Invalid search query</h1>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>
            Enter between {MIN_SEARCH_QUERY_LENGTH} and {MAX_SEARCH_QUERY_LENGTH} characters.
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
        />
      </Suspense>
    </Container>
  )
}
