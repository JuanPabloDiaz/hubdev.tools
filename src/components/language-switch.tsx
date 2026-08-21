'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import type { LanguageTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'
import { cn } from '@/utils/styles'

export function LanguageSwitch({
  locale,
  translations
}: {
  locale: Locale
  translations: LanguageTranslations
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const currentHref = `${pathname}${query ? `?${query}` : ''}`

  return (
    <div
      className='flex h-9 items-center rounded-lg border border-input bg-background p-0.5 text-xs font-semibold'
      role='group'
      aria-label={translations.language}
    >
      {(['es', 'en'] as const).map((option) => (
        <Link
          key={option}
          href={getLocalizedHref(currentHref, option)}
          replace
          scroll={false}
          aria-current={locale === option ? 'page' : undefined}
          aria-label={option === 'es' ? translations.spanish : translations.english}
          className={cn(
            'grid h-7 min-w-8 place-items-center rounded-md px-1.5 transition-colors',
            locale === option
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
