import { unstable_cache } from 'next/cache'

import type { Locale } from '@/i18n/config'

import { getFeaturedResources } from './dashboard'

const getFeaturedResourcesByLocale = unstable_cache(
  async (locale: Locale) => {
    return getFeaturedResources(locale)
  },
  ['featured_resources_i18n'],
  {
    revalidate: 3600
  }
)

export function getFeaturedResourcesCached(locale: Locale) {
  return getFeaturedResourcesByLocale(locale)
}
