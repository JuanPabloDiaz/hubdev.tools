import type { MetadataRoute } from 'next'

import { APP_URL } from '@/constants'
import { getCategories, getTaxonomyPaths } from '@/services/list'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, taxonomyPaths] = await Promise.all([getCategories(), getTaxonomyPaths()])

  if (!categories) {
    return [
      {
        url: APP_URL,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1
      }
    ]
  }

  const mappedCategories = categories.map((category) => ({
    url: `${APP_URL}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9
  }))

  const mappedSubcategories = (taxonomyPaths ?? []).map(({ categorySlug, subcategorySlug }) => ({
    url: `${APP_URL}/${categorySlug}/${subcategorySlug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8
  }))

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    ...mappedCategories,
    ...mappedSubcategories
  ]
}
