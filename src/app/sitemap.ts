import type { MetadataRoute } from 'next'

import { APP_URL } from '@/constants'
import { getCategories, getTaxonomyPaths } from '@/services/list'
import { localizePathname } from '@/i18n/routing'

function sitemapEntries(
  pathname: string,
  options: Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'>
): MetadataRoute.Sitemap {
  const englishPathname = localizePathname(pathname, 'en')
  const spanishPathname = localizePathname(pathname, 'es')
  const defaultUrl = `${APP_URL}${pathname === '/' ? '' : pathname}`
  const englishUrl = `${APP_URL}${englishPathname}`
  const spanishUrl = `${APP_URL}${spanishPathname}`
  const alternates = {
    languages: {
      en: englishUrl,
      es: spanishUrl,
      'x-default': defaultUrl
    }
  }

  return [
    {
      url: englishUrl,
      lastModified: new Date(),
      alternates,
      ...options
    },
    {
      url: spanishUrl,
      lastModified: new Date(),
      alternates,
      ...options
    }
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, taxonomyPaths] = await Promise.all([getCategories(), getTaxonomyPaths()])

  if (!categories) {
    return sitemapEntries('/', {
      changeFrequency: 'monthly',
      priority: 1
    })
  }

  const mappedCategories = categories.flatMap((category) =>
    sitemapEntries(`/${category.slug}`, {
      changeFrequency: 'daily',
      priority: 0.9
    })
  )

  const mappedSubcategories = (taxonomyPaths ?? []).flatMap(({ categorySlug, subcategorySlug }) =>
    sitemapEntries(`/${categorySlug}/${subcategorySlug}`, {
      changeFrequency: 'daily',
      priority: 0.8
    })
  )

  return [
    ...sitemapEntries('/', {
      changeFrequency: 'monthly',
      priority: 1
    }),
    ...mappedCategories,
    ...mappedSubcategories
  ]
}
