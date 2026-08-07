import type { Metadata } from 'next'

import { CollectionsOverview } from '@/components/collections-overview'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'

type CollectionsPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CollectionsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)
  return {
    title: dictionary.metadata.collections,
    description: dictionary.metadata.collectionsDescription,
    alternates: getAlternateUrls(getLocalizedHref('/collections', locale), locale)
  }
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return null
  const dictionary = await getDictionary(localeParam)

  return (
    <CollectionsOverview
      locale={localeParam}
      translations={dictionary.collections}
    />
  )
}
