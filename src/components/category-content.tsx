import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '@/components/container'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { Home } from '@/components/home'
import { LoadingResources } from '@/components/loading'
import { SubcategoryFilters } from '@/components/subcategory-filters'
import { getCategoryDetails, getSubcategoriesByCategorySlug } from '@/services/list'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedDescription, getLocalizedName } from '@/i18n/taxonomy'

type CategoryContentProps = {
  categorySlug: string
  locale: Locale
  subcategorySlug?: string
}

export async function CategoryContent({
  categorySlug,
  locale,
  subcategorySlug
}: CategoryContentProps) {
  const [category, subcategories] = await Promise.all([
    getCategoryDetails({
      slug: categorySlug
    }),
    getSubcategoriesByCategorySlug({
      categorySlug
    })
  ])

  if (!category) {
    notFound()
  }

  if (!subcategories) {
    const dictionary = await getDictionary(locale)
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  if (
    subcategorySlug &&
    !subcategories.some((subcategory) => subcategory.slug === subcategorySlug)
  ) {
    notFound()
  }

  return (
    <Container>
      <Hero
        title={getLocalizedName(category, locale)}
        description={getLocalizedDescription(category, locale)}
      />
      {subcategories.length > 0 ? (
        <SubcategoryFilters
          categorySlug={categorySlug}
          locale={locale}
          subcategories={subcategories.map((subcategory) => ({
            ...subcategory,
            name: getLocalizedName(subcategory, locale)
          }))}
          selectedSubcategory={subcategorySlug}
        />
      ) : null}
      <Suspense
        fallback={<LoadingResources />}
        key={subcategorySlug ?? categorySlug}
      >
        <Home
          locale={locale}
          slug={categorySlug}
          subcategory={subcategorySlug}
        />
      </Suspense>
    </Container>
  )
}
