import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CategoryContent } from '@/components/category-content'
import { getCategoryDetails } from '@/services/list'
import { getSearchHref } from '@/utils/search'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'
import { getLocalizedDescription, getLocalizedName } from '@/i18n/taxonomy'

export const maxDuration = 60

type CategoryPageProps = {
  params: Promise<{
    locale: string
    category: string
  }>
  searchParams: Promise<{
    query?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category, locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const data = await getCategoryDetails({
    slug: category
  })

  if (!data) {
    return {
      title: (await getDictionary(locale)).metadata.categories
    }
  }

  return {
    title: getLocalizedName(data, locale),
    description: getLocalizedDescription(data, locale),
    alternates: getAlternateUrls(getLocalizedHref(`/${category}`, locale), locale)
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ category, locale: localeParam }, { query }] = await Promise.all([params, searchParams])
  if (!isLocale(localeParam)) return null

  const locale: Locale = localeParam

  if (category === 'all') {
    redirect(getLocalizedHref('/', locale))
  }

  if (query) {
    redirect(getLocalizedHref(getSearchHref(query), locale))
  }

  return (
    <CategoryContent
      categorySlug={category}
      locale={locale}
    />
  )
}
