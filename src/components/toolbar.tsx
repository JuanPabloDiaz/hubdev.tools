'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { FormSearch } from '@/components/search-form'
import { SearchSuggestions } from '@/components/search-suggestions'
import { getSearchHref, isValidSearchQuery, normalizeSearchQuery } from '@/utils/search'
import type { SearchToolbarTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { getLocalizedHref, stripLocale } from '@/i18n/routing'

type ToolbarProps = {
  locale: Locale
  searchHistory: string[]
  translations: SearchToolbarTranslations
}

function saveSearch(input: string) {
  return fetch('/api/update-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input
    }),
    keepalive: true
  })
}

export function Toolbar({ locale, searchHistory, translations }: ToolbarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startNavigation] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const currentQuery = stripLocale(pathname) === '/search' ? (searchParams.get('q') ?? '') : ''
  const [value, setValue] = useState(currentQuery)

  useEffect(() => {
    setValue(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable

      if (event.key.toLowerCase() === 's' && !isTyping) {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const navigateToSearch = (input: string) => {
    const query = normalizeSearchQuery(input)

    if (!isValidSearchQuery(query)) {
      toast.error(translations.validation)
      return
    }

    setValue(query)
    setIsOpen(false)
    inputRef.current?.blur()

    startNavigation(() => {
      router.push(getLocalizedHref(getSearchHref(query), locale))
    })

    saveSearch(query).catch(() => undefined)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
      className='fixed left-1/2 top-2 z-50 w-[min(480px,calc(100%-104px))] -translate-x-1/2 transition-[width] duration-200 ease-out focus-within:w-[min(680px,calc(100%-16px))] motion-reduce:transition-none'
    >
      <div className='rounded-xl border border-light-700/70 bg-stone-50/95 backdrop-blur-xl transition-colors focus-within:border-light-800 dark:border-neutral-800 dark:bg-[#161616]/95 dark:focus-within:border-neutral-700'>
        <FormSearch
          inputRef={inputRef}
          isPending={isPending}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onClear={() => {
            setValue('')
            inputRef.current?.focus()
          }}
          onKeyDown={handleKeyDown}
          onSubmit={(event) => {
            event.preventDefault()
            navigateToSearch(value)
          }}
          translations={translations}
        />
      </div>

      {isOpen && (
        <SearchSuggestions
          history={searchHistory}
          onSelect={navigateToSearch}
          recentLabel={translations.recent}
        />
      )}
    </div>
  )
}
