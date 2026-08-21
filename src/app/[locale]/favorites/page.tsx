import { permanentRedirect } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'

export default async function FavoritesRedirect({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) return null

  permanentRedirect(getLocalizedHref('/collections', locale))
}
