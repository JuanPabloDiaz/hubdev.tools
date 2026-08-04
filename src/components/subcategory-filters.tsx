import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/styles'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedHref } from '@/i18n/routing'

type Subcategory = {
  id: number
  name: string
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
        'border-purple-500 bg-purple-500/10 text-purple-700 hover:bg-purple-500/15 hover:text-purple-700 dark:border-purple-300/60 dark:bg-purple-300/10 dark:text-purple-300 dark:hover:bg-purple-300/15 dark:hover:text-purple-300'
    )

  return (
    <div
      className='mt-6 flex flex-wrap items-center gap-2'
      role='group'
      aria-label={dictionary.categories.filterLabel}
    >
      <Link
        href={getLocalizedHref(`/${categorySlug}`, locale)}
        className={filterClassName(!selectedSubcategory)}
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
            className={filterClassName(isActive)}
            aria-current={isActive ? 'page' : undefined}
          >
            {subcategory.name}
          </Link>
        )
      })}
    </div>
  )
}
