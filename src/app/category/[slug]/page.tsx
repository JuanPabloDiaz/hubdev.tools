import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getCategoryDetails, getSubcategoriesByCategorySlug } from '@/services/list'
import { Container } from '@/components/container'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { Home } from '@/components/home'
import { LoadingResources } from '@/components/loading'
import { SubcategoryFilters } from '@/components/subcategory-filters'

export const maxDuration = 60

export async function generateMetadata({
  params
}: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> {
  const { slug } = await params

  const data = await getCategoryDetails({
    slug
  })

  if (!data) {
    return {
      title: 'Categories'
    }
  }

  const { name, description } = data

  return {
    title: name,
    description,
    alternates: {
      canonical: `/category/${slug}`
    }
  }
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    query?: string
    subcategory?: string
  }>
}) {
  const { slug } = await params

  if (slug === 'all') {
    redirect('/')
  }

  const [category, subcategories] = await Promise.all([
    getCategoryDetails({
      slug
    }),
    getSubcategoriesByCategorySlug({
      categorySlug: slug
    })
  ])

  if (!category) {
    notFound()
  }

  if (!subcategories) {
    return <ErrorState error='An error occurred. Please try again later.' />
  }

  const { query, subcategory } = await searchParams

  return (
    <Container>
      <Hero
        title={category.name}
        description={category.description ?? ''}
      />
      <SubcategoryFilters
        categorySlug={slug}
        subcategories={subcategories}
        selectedSubcategory={subcategory}
      />
      <Suspense
        fallback={<LoadingResources />}
        key={`${query ?? ''}:${subcategory ?? ''}`}
      >
        <Home
          query={query}
          slug={slug}
          subcategory={subcategory}
        />
      </Suspense>
    </Container>
  )
}
