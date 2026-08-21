import { RefObject } from 'react'
import { ArrowRight, LoaderCircle, Search, X } from 'lucide-react'

import { MAX_SEARCH_QUERY_LENGTH } from '@/utils/search'
import type { SearchToolbarTranslations } from '@/i18n/messages'

type FormSearchProps = {
  inputRef: RefObject<HTMLInputElement | null>
  isPending: boolean
  onClear: () => void
  onFocus: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void
  onValueChange: (value: string) => void
  translations: Pick<SearchToolbarTranslations, 'label' | 'placeholder' | 'clear' | 'submit'>
  value: string
}

export function FormSearch({
  inputRef,
  isPending,
  onClear,
  onFocus,
  onKeyDown,
  onSubmit,
  onValueChange,
  translations,
  value
}: FormSearchProps) {
  return (
    <form
      className='flex h-12 w-full items-center gap-2 px-2 sm:h-13'
      role='search'
      onSubmit={onSubmit}
    >
      <Search
        className='ml-1 size-4 shrink-0 text-neutral-500'
        aria-hidden='true'
      />
      <label
        className='sr-only'
        htmlFor='global-search'
      >
        {translations.label}
      </label>
      <input
        ref={inputRef}
        id='global-search'
        name='q'
        type='search'
        autoComplete='off'
        spellCheck='false'
        maxLength={MAX_SEARCH_QUERY_LENGTH}
        placeholder={translations.placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className='h-full min-w-0 flex-1 appearance-none bg-transparent text-sm text-foreground outline-hidden placeholder:text-neutral-500 sm:text-[15px] [&::-webkit-search-cancel-button]:hidden'
      />

      {value && (
        <button
          type='button'
          onClick={onClear}
          aria-label={translations.clear}
          className='grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-light-600/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary dark:hover:bg-neutral-800'
        >
          <X
            className='size-4'
            aria-hidden='true'
          />
        </button>
      )}

      {!value && (
        <kbd className='hidden rounded-md border border-light-700/70 bg-light-600/30 px-2 py-1 text-[11px] font-medium text-light-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 sm:block'>
          S
        </kbd>
      )}

      <button
        type='submit'
        disabled={isPending || !value.trim()}
        aria-label={translations.submit}
        className='grid size-9 shrink-0 place-items-center rounded-lg bg-light-900 text-white shadow-sm transition-all hover:bg-light-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
      >
        {isPending ? (
          <LoaderCircle
            className='size-4 animate-spin'
            aria-hidden='true'
          />
        ) : (
          <ArrowRight
            className='size-4'
            aria-hidden='true'
          />
        )}
      </button>
    </form>
  )
}
