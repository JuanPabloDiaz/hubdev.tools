import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { Container } from '@/components/container'
import { Hero } from '@/components/hero'
import { Home } from '@/components/home'
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
  const catalog = dictionary.catalog ?? {
    title: dictionary.metadata.categories,
    description: dictionary.metadata.description
  }

  return (
    <Container>
      <Hero
        title={catalog.title}
        description={catalog.description}
      />
      <Suspense fallback={<LoadingResources />}>
        <Home locale={locale as Locale} />
      </Suspense>
    </Container>
  )
}
