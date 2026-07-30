import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CategoryContent } from '@/components/category-content'
import { getSubcategoryDetails } from '@/services/list'
import { getSearchHref } from '@/utils/search'

export const maxDuration = 60

type SubcategoryPageProps = {
  params: Promise<{
    category: string
    subcategory: string
  }>
  searchParams: Promise<{
    query?: string
  }>
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params
  const data = await getSubcategoryDetails({
    categorySlug: category,
    subcategorySlug: subcategory
  })

  if (!data) {
    return {
      title: 'Categories'
    }
  }

  return {
    title: `${data.name} – ${data.category.name}`,
    description: data.description,
    alternates: {
      canonical: `/${category}/${subcategory}`
    }
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const [{ category, subcategory }, { query }] = await Promise.all([params, searchParams])

  if (query) {
    redirect(getSearchHref(query))
  }

  return (
    <CategoryContent
      categorySlug={category}
      subcategorySlug={subcategory}
    />
  )
}
