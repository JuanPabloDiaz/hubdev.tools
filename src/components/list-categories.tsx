import { getCategories } from '@/services/list'
import { CategoryPill } from '@/components/category-pill'
import type { Locale } from '@/i18n/config'
import type { SidebarCountTranslations } from '@/i18n/messages'
import { getLocalizedHref } from '@/i18n/routing'
import { getLocalizedName } from '@/i18n/taxonomy'

export async function ListCategories({
  locale,
  countTranslations
}: {
  locale: Locale
  countTranslations: SidebarCountTranslations
}) {
  const categories = await getCategories()

  return (
    <>
      {categories &&
        categories.length > 0 &&
        categories.map((category) => {
          const href = getLocalizedHref(`/${category.slug}`, locale)
          return (
            <CategoryPill
              key={category.id}
              name={getLocalizedName(category, locale)}
              slug={category.slug as string}
              href={href}
              resourceCount={category.resourceCount}
              countTranslations={countTranslations}
            />
          )
        })}
    </>
  )
}
