import { ErrorState } from '@/components/error-state'
import { ResourceRow } from '@/components/resource-row'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedHref } from '@/i18n/routing'
import { getRecentResources, getTopRankedResources } from '@/services/list'

const HOME_SECTION_SIZE = 8

export async function HomeLanding({ locale }: { locale: Locale }) {
  const [topRanked, recent, dictionary] = await Promise.all([
    getTopRankedResources({ locale, limit: HOME_SECTION_SIZE }),
    getRecentResources({ locale, limit: HOME_SECTION_SIZE }),
    getDictionary(locale)
  ])

  if (!topRanked || !recent) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  return (
    <div className='flex flex-col gap-10 py-6'>
      <ResourceRow
        title={dictionary.home.topRanked.title}
        description={dictionary.home.topRanked.description}
        resources={topRanked}
        resourceTranslations={dictionary.resources}
        collectionTranslations={dictionary.collections}
      />
      <ResourceRow
        title={dictionary.home.recent.title}
        description={dictionary.home.recent.description}
        resources={recent}
        resourceTranslations={dictionary.resources}
        collectionTranslations={dictionary.collections}
        viewAllHref={getLocalizedHref('/recent', locale)}
        viewAllLabel={dictionary.home.recent.viewAll}
      />
    </div>
  )
}
