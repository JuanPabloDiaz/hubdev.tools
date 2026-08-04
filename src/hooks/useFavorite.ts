import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

import { addFavorite, removeFavorite } from '@/actions/favorites'
import type { FavoriteTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

export function useFavorite({
  isFavorite,
  id,
  locale,
  translations
}: {
  isFavorite: boolean
  id: string
  locale: Locale
  translations: FavoriteTranslations
}) {
  const [isFav, setIsFav] = useState(isFavorite)
  const pathname = usePathname()

  function localizeError(error: string, operation: 'add' | 'remove') {
    if (locale === 'en') return error
    if (error.startsWith('Too many requests')) return translations.rateLimit
    if (error.startsWith('You have reached')) return translations.maximum
    return operation === 'add' ? translations.add : translations.remove
  }

  async function handleToggleFavorite() {
    if (isFav) {
      const result = await removeFavorite(id, pathname)
      if (result.error) {
        toast.error(localizeError(result.error, 'remove'))
        return
      }

      setIsFav(false)
    } else {
      const result = await addFavorite(id, pathname)
      if (result.error) {
        toast.error(localizeError(result.error, 'add'))
        return
      }

      setIsFav(true)
    }
  }

  return {
    isFav,
    handleToggleFavorite
  }
}
