import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/styles'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedHref } from '@/i18n/routing'

type Subcategory = {
  id: number
  title: string
  slug: string
}

type SubcategoryFiltersProps = {
  categorySlug: string
  locale: Locale
  subcategories: Subcategory[]
  selectedSubcategory?: string
}

export async function SubcategoryFilters({
  categorySlug,
  locale,
  subcategories,
  selectedSubcategory
}: SubcategoryFiltersProps) {
  const dictionary = await getDictionary(locale)
  const filterClassName = (isActive: boolean) =>
    cn(
      buttonVariants({
        variant: 'outline',
        size: 'sm'
      }),
      'rounded-full px-4',
      isActive &&
        'border-light-800 bg-light-700/20 text-light-950 hover:bg-light-700/30 hover:text-light-950 dark:border-purple-300/60 dark:bg-purple-300/10 dark:text-purple-300 dark:hover:bg-purple-300/15 dark:hover:text-purple-300'
    )

  return (
    <div
      className='mt-6 flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide'
      role='group'
      aria-label={dictionary.categories.filterLabel}
    >
      <Link
        href={getLocalizedHref(`/${categorySlug}`, locale)}
        className={cn(filterClassName(!selectedSubcategory), 'shrink-0')}
        aria-current={!selectedSubcategory ? 'page' : undefined}
      >
        {dictionary.categories.all}
      </Link>

      {subcategories.map((subcategory) => {
        const isActive = selectedSubcategory === subcategory.slug

        return (
          <Link
            key={subcategory.id}
            href={getLocalizedHref(`/${categorySlug}/${subcategory.slug}`, locale)}
            className={cn(filterClassName(isActive), 'shrink-0')}
            aria-current={isActive ? 'page' : undefined}
          >
            {subcategory.title}
          </Link>
        )
      })}
    </div>
  )
}
