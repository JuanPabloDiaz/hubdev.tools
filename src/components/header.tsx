import Link from 'next/link'

import { GitHubIc } from '@/components/icons'
import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { SubmitDialog } from '@/components/submit-dialog'
import { LanguageSwitch } from '@/components/language-switch'
import type { LanguageTranslations, SubmitTranslations, ThemeTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'

type HeaderProps = {
  locale: Locale
  homeLabel: string
  repositoryLabel: string
  languageTranslations: LanguageTranslations
  themeTranslations: ThemeTranslations
  submitTranslations: SubmitTranslations
  genericError: string
}

export function Header({
  locale,
  homeLabel,
  repositoryLabel,
  languageTranslations,
  themeTranslations,
  submitTranslations,
  genericError
}: HeaderProps) {
  return (
    <header className='bg-background shadow-xs sticky top-0 z-40'>
      <div className='flex items-center justify-between h-16 px-4 md:px-6'>
        <div className='flex items-center justify-end sm:justify-between w-full'>
          <Link
            href={getLocalizedHref('/', locale)}
            className='hidden sm:flex items-center gap-2 font-semibold'
            prefetch={false}
            aria-label={homeLabel}
          >
            <Logo className='size-6 md:size-7' />
            <span className='hidden md:block text-sm md:text-base'>hubdev</span>
          </Link>
          <div className='flex items-center gap-2'>
            <LanguageSwitch
              locale={locale}
              translations={{
                language: languageTranslations.language,
                english: languageTranslations.english,
                spanish: languageTranslations.spanish
              }}
            />
            <div className='hidden sm:contents'>
              <ModeToggle translations={themeTranslations} />
              <a
                href='https://github.com/xavimondev/hubdev.tools'
                target='_blank'
                className='inline-flex items-center justify-center bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200 size-10 rounded-md'
                rel='noreferrer noopener'
                aria-label={repositoryLabel}
              >
                <GitHubIc className='size-5' />
              </a>
              <SubmitDialog
                translations={submitTranslations}
                genericError={genericError}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
