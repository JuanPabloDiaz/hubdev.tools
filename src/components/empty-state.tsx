'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AsteriskIcon, FrownIcon } from 'lucide-react'

import type { NoResultsTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'
import { getSearchHref } from '@/utils/search'

export function NoResultsSearch({
  locale,
  translations
}: {
  locale: Locale
  translations: NoResultsTranslations
}) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    replace(getLocalizedHref(getSearchHref(term), locale))
  }

  return (
    <div className='flex flex-col justify-center bg-background px-4 py-12 mx-auto max-w-lg'>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-center'>
          <FrownIcon className='mx-auto size-36 text-primary' />
          <h3 className='mt-4 text-xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {translations.title}
          </h3>
          <p className='mt-1 text-yellow-900 dark:text-yellow-500 text-lg'>
            {searchParams.get('q')?.toString() ?? searchParams.get('query')?.toString()}
          </p>
        </div>
      </div>
      <div className='grid gap-4 mt-5'>
        <span className='text-gray-700 dark:text-link'>{translations.suggestions}</span>
        <ul className='grid gap-2 text-sm'>
          <li
            className='flex items-center border border-neutral-600/30 dark:border-neutral-600/50 hover:bg-light-600/40 dark:hover:bg-neutral-900 p-2 rounded-md cursor-pointer transition duration-300'
            onClick={() => {
              handleSearch(translations.items[0])
            }}
          >
            <AsteriskIcon className='mr-2 text-yellow-700 dark:text-yellow-300 size-4' />
            <span className='text-gray-700 dark:text-white font-semibold text-left'>
              {translations.items[0]}
            </span>
          </li>
          <li
            className='flex items-center border border-neutral-600/30 dark:border-neutral-600/50 hover:bg-light-600/40 dark:hover:bg-neutral-900 p-2 rounded-md cursor-pointer transition duration-300'
            onClick={() => {
              handleSearch(translations.items[1])
            }}
          >
            <AsteriskIcon className='mr-2 text-yellow-700 dark:text-yellow-300 size-4' />
            <span className='text-gray-700 dark:text-white font-semibold text-left'>
              {translations.items[1]}
            </span>
          </li>
          <li
            className='flex items-center border border-neutral-600/30 dark:border-neutral-600/50 hover:bg-light-600/40 dark:hover:bg-neutral-900 p-2 rounded-md cursor-pointer transition duration-300'
            onClick={() => {
              handleSearch(translations.items[2])
            }}
          >
            <AsteriskIcon className='mr-2 text-yellow-700 dark:text-yellow-300 size-4' />
            <span className='text-gray-700 dark:text-white font-semibold text-left'>
              {translations.items[2]}
            </span>
          </li>
          <li
            className='flex items-center border border-neutral-600/30 dark:border-neutral-600/50 hover:bg-light-600/40 dark:hover:bg-neutral-900 p-2 rounded-md cursor-pointer transition duration-300'
            onClick={() => {
              handleSearch(translations.items[3])
            }}
          >
            <AsteriskIcon className='mr-2 text-yellow-700 dark:text-yellow-300 size-4' />
            <span className='text-gray-700 dark:text-white font-semibold text-left'>
              {translations.items[3]}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
