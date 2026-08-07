import { ErrorState } from '@/components/error-state'
import { ResourceItem } from '@/components/list-resource'
import { SearchResource } from '@/types/search'
import { TextSearchResult } from '@/services/text-search'
import type { Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'
import { formatMessage } from '@/i18n/messages'

type SearchResultsProps = {
  query: string
  searchPromise: Promise<TextSearchResult>
  locale: Locale
}

export async function SearchResults({ query, searchPromise, locale }: SearchResultsProps) {
  const [dictionary, result] = await Promise.all([getDictionary(locale), searchPromise])

  if (result.error) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  const { resources } = result

  if (resources.length === 0) {
    return (
      <SearchEmptyState
        dictionary={dictionary}
        query={query}
      />
    )
  }

  return (
    <section aria-labelledby='search-results-heading'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='space-y-1'>
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-light-800 dark:text-neutral-500'>
            {dictionary.search.results.label}
          </p>
          <h1
            id='search-results-heading'
            className='text-2xl font-semibold tracking-tight text-balance sm:text-3xl'
          >
            {formatMessage(dictionary.search.results.title, { query })}
          </h1>
        </div>
        <p
          className='text-sm text-muted-foreground'
          aria-live='polite'
        >
          {resources.length}{' '}
          {resources.length === 1
            ? dictionary.search.results.resourceSingular
            : dictionary.search.results.resourcePlural}
        </p>
      </div>

      <SearchResourceGrid
        resources={resources}
        dictionary={dictionary}
      />
    </section>
  )
}

function SearchResourceGrid({
  resources,
  dictionary
}: {
  resources: SearchResource[]
  dictionary: Dictionary
}) {
  return (
    <div className='grid grid-cols-1 gap-5 py-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {resources.map((resource, index) => (
        <ResourceItem
          key={resource.id}
          id={resource.id}
          title={resource.title}
          url={resource.url}
          summary={resource.summary}
          brief={resource.brief}
          image={resource.image}
          placeholder={resource.placeholder}
          order={index}
          rankPosition={resource.rankPosition}
          resourceTranslations={dictionary.resources}
          collectionTranslations={dictionary.collections}
        />
      ))}
    </div>
  )
}

function SearchEmptyState({ dictionary, query }: { dictionary: Dictionary; query: string }) {
  return (
    <section className='mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center'>
      <div className='mb-5 grid size-16 place-items-center rounded-2xl border border-light-700/60 bg-light-600/20 text-2xl dark:border-neutral-800 dark:bg-neutral-900'>
        ∅
      </div>
      <h1 className='text-2xl font-semibold tracking-tight'>{dictionary.search.empty.title}</h1>
      <p className='mt-2 text-pretty text-sm leading-6 text-muted-foreground'>
        {formatMessage(dictionary.search.empty.description, { query })}
      </p>
    </section>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div aria-hidden='true'>
      <div className='space-y-3'>
        <div className='h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-9 w-full max-w-xl animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-900' />
      </div>
      <div className='grid grid-cols-1 gap-5 py-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className='h-[280px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900'
          />
        ))}
      </div>
    </div>
  )
}
