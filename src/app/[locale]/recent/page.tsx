import { Suspense } from 'react'
import { Metadata } from 'next'

import { listRecentResourcesPage } from '@/actions/resources'
import { CATALOG_PAGE_SIZE } from '@/constants'
import { Container } from '@/components/container'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { LoadingResources } from '@/components/loading'
import { PanelResources } from '@/components/panel-resources'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'
import { getRecentResourcesPage } from '@/services/list'

export const maxDuration = 60

type RecentPageProps = {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: RecentPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)
  const pathname = getLocalizedHref('/recent', locale)

  return {
    title: dictionary.metadata.recent,
    alternates: getAlternateUrls(pathname, locale)
  }
}

export default async function RecentPage({ params }: RecentPageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return null

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)

  return (
    <Container>
      <Hero
        title={dictionary.home.recent.title}
        description={dictionary.home.recent.description}
      />
      <Suspense fallback={<LoadingResources />}>
        <RecentResources locale={locale} />
      </Suspense>
    </Container>
  )
}

async function RecentResources({ locale }: { locale: Locale }) {
  const [resources, dictionary] = await Promise.all([
    getRecentResourcesPage({ locale, offset: 0, limit: CATALOG_PAGE_SIZE }),
    getDictionary(locale)
  ])

  if (!resources) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  return (
    <PanelResources
      resources={resources}
      locale={locale}
      resourceTranslations={dictionary.resources}
      collectionTranslations={dictionary.collections}
      noResultsTranslations={dictionary.search.databaseEmpty}
      fetchAction={listRecentResourcesPage}
    />
  )
}
