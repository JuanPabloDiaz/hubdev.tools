import { cache } from 'react'

import { SearchResource } from '@/types/search'

import { supabase } from '@/services/client'
import { isValidSearchQuery, normalizeSearchQuery } from '@/utils/search'

export type TextSearchResult =
  | {
      resources: SearchResource[]
      error?: never
    }
  | {
      resources: []
      error: string
    }

export const searchResourcesText = cache(async (input: string): Promise<TextSearchResult> => {
  const query = normalizeSearchQuery(input)

  if (!isValidSearchQuery(query)) {
    return {
      resources: [],
      error: 'Search queries must contain between 2 and 120 characters.'
    }
  }

  const { data, error } = await supabase.rpc('search_resources_text', {
    search_query: query,
    match_count: 10
  })

  if (error) {
    console.error(error)
    return {
      resources: [],
      error: 'An error occurred while searching for resources.'
    }
  }

  return {
    resources: (data ?? []).map((resource, index) => ({
      ...resource,
      rankPosition: index + 1
    }))
  }
})
