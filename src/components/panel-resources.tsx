'use client'

import { useRef, useState } from 'react'
import { listResources, listResourcesBySlug } from '@/actions/resources'

import { Resource } from '@/types/resource'

import { NUMBER_OF_GENERATIONS_TO_FETCH } from '@/constants'
import { ListResource } from '@/components/list-resource'
import { LoadMore } from '@/components/load-more'
import type {
  FavoriteTranslations,
  NoResultsTranslations,
  ResourceTranslations
} from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

type PanelResourcesProps = {
  resources: Resource[]
  favoritesIds: string[]
  slug?: string
  subcategory?: string
  locale: Locale
  resourceTranslations: ResourceTranslations
  favoriteTranslations: FavoriteTranslations
  noResultsTranslations: NoResultsTranslations
}

export function PanelResources({
  resources,
  favoritesIds,
  slug,
  subcategory,
  locale,
  resourceTranslations,
  favoriteTranslations,
  noResultsTranslations
}: PanelResourcesProps) {
  const isLastRequest = useRef(false)
  const [data, setData] = useState<Resource[]>(resources)
  const [hasResources, setHasResources] = useState(
    resources.length > NUMBER_OF_GENERATIONS_TO_FETCH
  )
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreResources = async () => {
    if (isLastRequest.current || !data) return

    const from = data.length
    const to = data.length + NUMBER_OF_GENERATIONS_TO_FETCH

    setIsLoading(true)

    const results = slug
      ? await listResourcesBySlug({
          from,
          to,
          slug,
          subcategory
        })
      : await listResources({
          from,
          to
        })

    setIsLoading(false)

    if (!results) return

    if (results.length > 0) {
      setData((prevData) => prevData.concat(results))
    }

    // Hidding the load more button
    if (results.length < NUMBER_OF_GENERATIONS_TO_FETCH + 1) {
      isLastRequest.current = true
      setHasResources(false)
    }
  }

  return (
    <>
      <ListResource
        data={data}
        favoritesIds={favoritesIds}
        locale={locale}
        resourceTranslations={resourceTranslations}
        favoriteTranslations={favoriteTranslations}
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
