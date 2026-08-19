import { cache } from 'react'

import type { Locale } from '@/i18n/config'

import { supabase } from '@/services/client'
import { isValidSearchQuery, normalizeSearchQuery } from '@/utils/search'
import { Resource } from '@/types/resource'

export type TextSearchResult =
  | {
      resources: Resource[]
      error?: never
    }
  | {
      resources: []
      error: string
    }

export const searchResourcesText = cache(
  async (input: string, locale: Locale): Promise<TextSearchResult> => {
    const query = normalizeSearchQuery(input)

    if (!isValidSearchQuery(query)) {
      return {
        resources: [],
        error: 'Search queries must contain between 2 and 120 characters.'
      }
    }

    const { data, error } = await supabase.rpc('search_resources_text', {
      search_query: query,
      match_count: 20,
      display_locale: locale
    })

    if (error) {
      console.error(error)
      return {
        resources: [],
        error: 'An error occurred while searching for resources.'
      }
    }

    return {
      resources: data ?? []
    }
  }
)
