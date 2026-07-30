import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/styles'

type Subcategory = {
  id: number
  name: string
  slug: string
}

type SubcategoryFiltersProps = {
  categorySlug: string
  subcategories: Subcategory[]
  selectedSubcategory?: string
}

export function SubcategoryFilters({
  categorySlug,
  subcategories,
  selectedSubcategory
}: SubcategoryFiltersProps) {
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
      aria-label='Filter resources by subcategory'
    >
      <Link
        href={`/${categorySlug}`}
        className={filterClassName(!selectedSubcategory)}
        aria-current={!selectedSubcategory ? 'page' : undefined}
      >
        All
      </Link>

      {subcategories.map((subcategory) => {
        const isActive = selectedSubcategory === subcategory.slug

        return (
          <Link
            key={subcategory.id}
            href={`/${categorySlug}/${subcategory.slug}`}
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
