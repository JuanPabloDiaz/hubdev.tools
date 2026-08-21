'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import type { Locale } from '@/i18n/config'
import type { NotFoundTranslations } from '@/i18n/messages'

export function NotFoundContent({
  translations
}: {
  translations: Record<Locale, NotFoundTranslations>
}) {
  const { locale: localeParam } = useParams<{ locale: string }>()
  const locale: Locale = localeParam === 'es' ? 'es' : 'en'
  const messages = translations[locale]

  return (
    <div className='flex flex-col items-center justify-center bg-background px-4 mt-[280px]'>
      <div className='text-center'>
        <h1 className='text-7xl sm:text-9xl font-bold text-foreground mb-4'>404</h1>
        <p className='text-base sm:text-xl text-muted-foreground mb-8 max-w-md'>
          {messages.description}
        </p>
        <Link
          href={`/${locale}`}
          className='inline-block bg-secondary text-white px-4 py-2 rounded-md hover:bg-neutral-900 transition-colors duration-150'
        >
          {messages.home}
        </Link>
      </div>
    </div>
  )
}
