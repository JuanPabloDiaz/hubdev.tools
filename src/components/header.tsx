import Link from 'next/link'

import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitch } from '@/components/language-switch'
import type { LanguageTranslations, ThemeTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'

type HeaderProps = {
  locale: Locale
  homeLabel: string
  languageTranslations: LanguageTranslations
  themeTranslations: ThemeTranslations
}

export function Header({
  locale,
  homeLabel,
  languageTranslations,
  themeTranslations
}: HeaderProps) {
  return (
    <header className='bg-background sticky top-0 z-40'>
      <div className='flex items-center justify-between h-16 px-4 md:px-6'>
        <div className='flex items-center justify-end sm:justify-between w-full'>
          <Link
            href={getLocalizedHref('/', locale)}
            className='hidden sm:flex items-center gap-2 font-semibold'
            prefetch={false}
            aria-label={homeLabel}
          >
            <span className='hidden md:block text-base md:text-3xl'>hubdev</span>
          </Link>
          <div className='flex items-center gap-2'>
            <div className='hidden sm:contents'>
              <LanguageSwitch
                locale={locale}
                translations={{
                  language: languageTranslations.language,
                  english: languageTranslations.english,
                  spanish: languageTranslations.spanish
                }}
              />
              <ModeToggle translations={themeTranslations} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
