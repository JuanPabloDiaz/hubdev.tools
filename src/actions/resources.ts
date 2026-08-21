'use server'

import { CATALOG_PAGE_SIZE } from '@/constants'
import { isLocale } from '@/i18n/config'
import { getRecentResourcesPage, getResourcesPage } from '@/services/list'
import type { CatalogResource } from '@/types/catalog'

export type ListResourcesPageResult = { resources: CatalogResource[] } | { error: string }

export type FetchResourcesPageParams = {
  locale: string
  offset: number
  categorySlug?: string
  subcategorySlug?: string
}

export type FetchResourcesPageAction = (
  params: FetchResourcesPageParams
) => Promise<ListResourcesPageResult>

export async function listResourcesPage({
  locale,
  offset,
  categorySlug,
  subcategorySlug
}: FetchResourcesPageParams): Promise<ListResourcesPageResult> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0) {
    return {
      error: 'Invalid catalog pagination parameters.'
    }
  }

  const resources = await getResourcesPage({
    locale,
    offset,
    limit: CATALOG_PAGE_SIZE,
    categorySlug,
    subcategorySlug
  })

  if (!resources) {
    return {
      error: 'Unable to load catalog resources.'
    }
  }

  return { resources }
}

export async function listRecentResourcesPage({
  locale,
  offset
}: FetchResourcesPageParams): Promise<ListResourcesPageResult> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0) {
    return {
      error: 'Invalid catalog pagination parameters.'
    }
  }

  const resources = await getRecentResourcesPage({
    locale,
    offset,
    limit: CATALOG_PAGE_SIZE
  })

  if (!resources) {
    return {
      error: 'Unable to load catalog resources.'
    }
  }

  return { resources }
}
