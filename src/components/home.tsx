import { listResourcesPage } from '@/actions/resources'
import { CATALOG_PAGE_SIZE } from '@/constants'
import { ErrorState } from '@/components/error-state'
import { PanelResources } from '@/components/panel-resources'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getResourcesPage } from '@/services/list'

type HomeProps = {
  locale: Locale
  slug?: string
  subcategory?: string
}

export async function Home({ locale, slug, subcategory }: HomeProps) {
  const [resources, dictionary] = await Promise.all([
    getResourcesPage({
      locale,
      offset: 0,
      limit: CATALOG_PAGE_SIZE,
      categorySlug: slug,
      subcategorySlug: subcategory
    }),
    getDictionary(locale)
  ])

  if (!resources) {
    return (
      <ErrorState
        title={dictionary.errors.title}
        error={dictionary.errors.generic}
      />
    )
  }

  return (
    <PanelResources
      key={`${locale}:${slug ?? 'all'}:${subcategory ?? 'all'}`}
      resources={resources}
      categorySlug={slug}
      subcategorySlug={subcategory}
      locale={locale}
      resourceTranslations={dictionary.resources}
      collectionTranslations={dictionary.collections}
      noResultsTranslations={dictionary.search.databaseEmpty}
      fetchAction={listResourcesPage}
    />
  )
}
