'use client'

import { useRef, useState } from 'react'

import type { FetchResourcesPageAction } from '@/actions/resources'
import { CATALOG_PAGE_SIZE } from '@/constants'
import { ListResource } from '@/components/list-resource'
import { LoadMore } from '@/components/load-more'
import type { CatalogResource } from '@/types/catalog'
import type {
  CollectionsTranslations,
  NoResultsTranslations,
  ResourceTranslations
} from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

type PanelResourcesProps = {
  resources: CatalogResource[]
  categorySlug?: string
  subcategorySlug?: string
  locale: Locale
  resourceTranslations: ResourceTranslations
  collectionTranslations: CollectionsTranslations
  noResultsTranslations: NoResultsTranslations
  fetchAction: FetchResourcesPageAction
}

export function PanelResources({
  resources,
  categorySlug,
  subcategorySlug,
  locale,
  resourceTranslations,
  collectionTranslations,
  noResultsTranslations,
  fetchAction
}: PanelResourcesProps) {
  const isLastRequest = useRef(false)
  const [data, setData] = useState<CatalogResource[]>(resources)
  const [hasResources, setHasResources] = useState(resources.length > CATALOG_PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreResources = async () => {
    if (isLastRequest.current || !data) return

    setIsLoading(true)

    const result = await fetchAction({ locale, offset: data.length, categorySlug, subcategorySlug })

    setIsLoading(false)

    if ('error' in result) return

    if (result.resources.length > 0) {
      setData((currentResources) => currentResources.concat(result.resources))
    }

    // Hidding the load more button
    if (result.resources.length < CATALOG_PAGE_SIZE + 1) {
      isLastRequest.current = true
      setHasResources(false)
    }
  }

  return (
    <>
      <ListResource
        data={data}
        locale={locale}
        resourceTranslations={resourceTranslations}
        collectionTranslations={collectionTranslations}
        noResultsTranslations={noResultsTranslations}
      />
      {hasResources && (
        <LoadMore
          loadMoreResources={loadMoreResources}
          isLoading={isLoading}
          label={resourceTranslations.loadMore}
        />
      )}
    </>
  )
}
