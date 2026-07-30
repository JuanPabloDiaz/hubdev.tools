import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '@/components/container'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { Home } from '@/components/home'
import { LoadingResources } from '@/components/loading'
import { SubcategoryFilters } from '@/components/subcategory-filters'
import { getCategoryDetails, getSubcategoriesByCategorySlug } from '@/services/list'

type CategoryContentProps = {
  categorySlug: string
  subcategorySlug?: string
}

export async function CategoryContent({ categorySlug, subcategorySlug }: CategoryContentProps) {
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
    return <ErrorState error='An error occurred. Please try again later.' />
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
        title={category.name}
        description={category.description ?? ''}
      />
      {subcategories.length > 0 ? (
        <SubcategoryFilters
          categorySlug={categorySlug}
          subcategories={subcategories}
          selectedSubcategory={subcategorySlug}
        />
      ) : null}
      <Suspense
        fallback={<LoadingResources />}
        key={subcategorySlug ?? categorySlug}
      >
        <Home
          slug={categorySlug}
          subcategory={subcategorySlug}
        />
      </Suspense>
    </Container>
  )
}
