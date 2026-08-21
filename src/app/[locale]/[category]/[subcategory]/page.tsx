import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CategoryContent } from '@/components/category-content'
import { getSubcategoryDetails } from '@/services/list'
import { getSearchHref } from '@/utils/search'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'

export const maxDuration = 60

type SubcategoryPageProps = {
  params: Promise<{
    locale: string
    category: string
    subcategory: string
  }>
  searchParams: Promise<{
    query?: string
  }>
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, locale: localeParam, subcategory } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const data = await getSubcategoryDetails({
    categorySlug: category,
    subcategorySlug: subcategory,
    locale
  })

  if (!data) {
    return {
      title: (await getDictionary(locale)).metadata.categories
    }
  }

  return {
    title: `${data.title} – ${data.category.title}`,
    description: data.category.description,
    alternates: getAlternateUrls(getLocalizedHref(`/${category}/${subcategory}`, locale), locale)
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const [{ category, locale: localeParam, subcategory }, { query }] = await Promise.all([
    params,
    searchParams
  ])
  if (!isLocale(localeParam)) return null

  const locale: Locale = localeParam

  if (query) {
    redirect(getLocalizedHref(getSearchHref(query), locale))
  }

  return (
    <CategoryContent
      categorySlug={category}
      subcategorySlug={subcategory}
      locale={locale}
    />
  )
}
