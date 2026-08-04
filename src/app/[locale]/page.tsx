import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { Container } from '@/components/container'
import { Dashboard } from '@/components/dashboard'
import { isLocale } from '@/i18n/config'
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

  return (
    <Container>
      <Suspense>
        <Dashboard locale={locale} />
      </Suspense>
    </Container>
  )
}
