import { AISuggestionsResources } from '@/components/ai-suggestions-resources'
import { FeaturedResources } from '@/components/featured-resources'
import { LatestResources } from '@/components/latest-resources'
import type { Locale } from '@/i18n/config'

export function Dashboard({ locale }: { locale: Locale }) {
  return (
    <>
      <FeaturedResources locale={locale} />
      <AISuggestionsResources locale={locale} />
      <LatestResources locale={locale} />
    </>
  )
}
