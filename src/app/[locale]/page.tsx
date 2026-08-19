import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { Container } from '@/components/container'
import { Hero } from '@/components/hero'
import { HomeLanding } from '@/components/home-landing'
import { LoadingResources } from '@/components/loading'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedHref } from '@/i18n/routing'
import { getSearchHref } from '@/utils/search'

export const maxDuration = 60

export default async function MainPage({
  params,
  searchParams
}: {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    query?: string
  }>
}) {
  const [{ locale }, { query }] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null

  if (query) {
    redirect(getLocalizedHref(getSearchHref(query), locale))
  }

  const dictionary = await getDictionary(locale)

  return (
    <Container>
      <Hero
        title={dictionary.home.hero.title}
        description={dictionary.home.hero.description}
      />
      <Suspense fallback={<LoadingResources />}>
        <HomeLanding locale={locale as Locale} />
      </Suspense>
    </Container>
  )
}
