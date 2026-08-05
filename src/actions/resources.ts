'use server'

import { CATALOG_PAGE_SIZE } from '@/constants'
import { isLocale } from '@/i18n/config'
import { getResourcesPage } from '@/services/list'
import type { CatalogPage } from '@/types/catalog'

type ListResourcesPageResult = CatalogPage | { error: string }

export async function listResourcesPage({
  locale,
  offset,
  categorySlug,
  subcategorySlug
}: {
  locale: string
  offset: number
  categorySlug?: string
  subcategorySlug?: string
}): Promise<ListResourcesPageResult> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0) {
    return {
      error: 'Invalid catalog pagination parameters.'
    }
  }

  const page = await getResourcesPage({
    locale,
    offset,
    limit: CATALOG_PAGE_SIZE,
    categorySlug,
    subcategorySlug
  })

  if (!page) {
    return {
      error: 'Unable to load catalog resources.'
    }
  }

  return page
}
