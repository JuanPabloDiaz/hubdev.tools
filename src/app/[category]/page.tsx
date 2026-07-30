import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CategoryContent } from '@/components/category-content'
import { getCategoryDetails } from '@/services/list'
import { getSearchHref } from '@/utils/search'

export const maxDuration = 60

type CategoryPageProps = {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    query?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const data = await getCategoryDetails({
    slug: category
  })

  if (!data) {
    return {
      title: 'Categories'
    }
  }

  return {
    title: data.name,
    description: data.description,
    alternates: {
      canonical: `/${category}`
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ category }, { query }] = await Promise.all([params, searchParams])

  if (category === 'all') {
    redirect('/')
  }

  if (query) {
    redirect(getSearchHref(query))
  }

  return <CategoryContent categorySlug={category} />
}
