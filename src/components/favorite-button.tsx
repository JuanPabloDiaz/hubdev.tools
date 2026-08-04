'use client'

import { HeartIcon } from 'lucide-react'

import { useFavorite } from '@/hooks/useFavorite'
import type { FavoriteTranslations } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'
import { cn } from '@/utils/styles'

export function FavoriteButton({
  id,
  isFavorite,
  locale,
  translations,
  addLabel,
  removeLabel,
  iconClassName
}: {
  id: string
  isFavorite: boolean
  locale: Locale
  translations: FavoriteTranslations
  addLabel: string
  removeLabel: string
  iconClassName?: string
}) {
  const { handleToggleFavorite, isFav } = useFavorite({
    isFavorite,
    id,
    locale,
    translations
  })

  return (
    <button
      type='button'
      className='cursor-pointer'
      onClick={handleToggleFavorite}
      aria-label={isFav ? removeLabel : addLabel}
    >
      <HeartIcon
        className={cn(
          'size-4 mr-2 hover:scale-110 text-light-800 dark:text-red-400',
          isFav && 'fill-light-800 dark:fill-red-400',
          iconClassName
        )}
      />
    </button>
  )
}
