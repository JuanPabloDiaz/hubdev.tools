import { getHistory } from '@/services/history'
import { Toolbar } from '@/components/toolbar'
import type { SearchToolbarTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

export async function AISearch({
  locale,
  translations
}: {
  locale: Locale
  translations: SearchToolbarTranslations
}) {
  const history = await getHistory()

  return (
    <Toolbar
      locale={locale}
      searchHistory={history}
      translations={translations}
    />
  )
}
