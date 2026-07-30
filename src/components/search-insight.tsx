import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { SearchResource } from '@/types/search'

import { generateSearchInsight } from '@/services/search-insight'
import { getSearchHref } from '@/utils/search'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedStatement({
  text,
  citedResourceIds,
  resources
}: {
  text: string
  citedResourceIds: string[]
  resources: SearchResource[]
}) {
  const plainText = text.replaceAll('**', '').replaceAll('__', '')
  const citedIds = new Set(citedResourceIds)
  const titles = resources
    .filter(
      ({ id, title }) => citedIds.has(id) && plainText.toLowerCase().includes(title.toLowerCase())
    )
    .map(({ title }) => title)
    .sort((first, second) => second.length - first.length)

  if (titles.length === 0) return plainText

  const titleSet = new Set(titles.map((title) => title.toLowerCase()))
  const titlePattern = new RegExp(`(${titles.map(escapeRegExp).join('|')})`, 'gi')

  return plainText.split(titlePattern).map((part, index) =>
    titleSet.has(part.toLowerCase()) ? (
      <strong
        key={`${part}-${index}`}
        className='font-bold text-violet-700 dark:text-violet-300'
      >
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export async function SearchInsightCard({
  query,
  resources
}: {
  query: string
  resources: SearchResource[]
}) {
  const insight = await generateSearchInsight({
    query,
    resources
  })

  if (!insight) return null

  return (
    <div className='mt-6 overflow-hidden rounded-xl border border-light-700/70 bg-linear-to-br from-light-600/25 via-background to-blue-100/40 p-4 dark:border-neutral-800 dark:from-violet-500/8 dark:via-[#111] dark:to-blue-500/6 sm:px-5 sm:py-6'>
      <div className='flex gap-3'>
        <div className='grid size-9 place-items-center rounded-lg border border-light-700/60 bg-light-500 text-light-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100'>
          <Sparkles
            className='size-4'
            aria-hidden='true'
          />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-xs font-medium uppercase tracking-[0.16em] text-light-800 dark:text-neutral-500'>
            Search insight
          </p>
          <h2
            id='search-insight-heading'
            className='mt-1 text-xl font-semibold tracking-tight'
          >
            {insight.headline}
          </h2>
          <div className='mt-3 max-w-4xl space-y-3 text-sm text-gray-700 dark:text-neutral-300'>
            {insight.statements.map((statement, index) => (
              <p key={`${statement.text}-${index}`}>
                <HighlightedStatement
                  text={statement.text}
                  citedResourceIds={statement.citedResourceIds}
                  resources={resources}
                />
              </p>
            ))}
          </div>

          <div className='mt-5 flex flex-wrap gap-2'>
            {insight.quickActions.map((action) => (
              <Link
                key={`${action.label}-${action.query}`}
                href={getSearchHref(action.query)}
                className='group inline-flex min-h-10 items-center gap-1.5 rounded-full border border-light-700/70 bg-background/70 px-3 text-sm font-medium text-light-950 transition-colors hover:bg-light-600/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
              >
                <Sparkles
                  className='size-3.5 text-violet-600 transition-transform group-hover:scale-110 dark:text-violet-300'
                  aria-hidden='true'
                />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SearchInsightSkeleton() {
  return (
    <div
      aria-hidden='true'
      className='mt-6 rounded-xl border border-light-700/70 bg-linear-to-br from-light-600/25 via-background to-blue-100/40 p-4 shadow-xs dark:border-neutral-800 dark:from-violet-500/8 dark:via-[#111] dark:to-blue-500/6 sm:p-5 flex items-center'
    >
      <div className='flex animate-pulse gap-3'>
        <div className='size-9 rounded-lg bg-neutral-200 dark:bg-neutral-800' />
        <div className='w-full max-w-4xl'>
          <div className='h-2.5 w-44 rounded-full bg-neutral-200 dark:bg-neutral-800' />
          <div className='mt-3 h-5 w-72 max-w-[75%] rounded-md bg-neutral-200 dark:bg-neutral-800' />
          <div className='mt-5 space-y-2.5'>
            <div className='h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-3 w-[88%] rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-3 w-[94%] rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-3 w-[68%] rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-3 w-[91%] rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-3 w-[74%] rounded-full bg-neutral-200 dark:bg-neutral-800' />
          </div>
          <div className='mt-5 flex gap-2'>
            <div className='h-10 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='h-10 w-40 rounded-full bg-neutral-200 dark:bg-neutral-800' />
            <div className='hidden h-10 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800 sm:block' />
          </div>
        </div>
      </div>
    </div>
  )
}
