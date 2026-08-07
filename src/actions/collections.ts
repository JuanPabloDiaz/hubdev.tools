'use server'

import { isLocale } from '@/i18n/config'
import { getCollectionResources } from '@/services/collections'
import { MAX_RESOURCES_PER_COLLECTION } from '@/types/collection'
import type { CollectionResource } from '@/types/collection'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type ListCollectionResourcesResult = { resources: CollectionResource[] } | { error: string }

export async function listCollectionResources({
  ids,
  locale
}: {
  ids: string[]
  locale: string
}): Promise<ListCollectionResourcesResult> {
  if (
    !isLocale(locale) ||
    !Array.isArray(ids) ||
    ids.length > MAX_RESOURCES_PER_COLLECTION ||
    ids.some((id) => typeof id !== 'string' || !UUID_PATTERN.test(id))
  ) {
    return { error: 'Invalid collection resource parameters.' }
  }

  const resourceIds = [...new Set(ids)]

  const resources = await getCollectionResources(resourceIds, locale)
  if (!resources) {
    return { error: 'Unable to load collection resources.' }
  }

  return { resources }
}
