import { getCategories } from '@/services/list'
import { CategoryPill } from '@/components/category-pill'
import type { Locale } from '@/i18n/config'
import type { SidebarCountTranslations } from '@/i18n/messages'
import { getLocalizedHref } from '@/i18n/routing'

export async function ListCategories({
  locale,
  countTranslations
}: {
  locale: Locale
  countTranslations: SidebarCountTranslations
}) {
  const categories = await getCategories(locale)

  return (
    <>
      {categories &&
        categories.length > 0 &&
        categories.map((category) => {
          const href = getLocalizedHref(`/${category.slug}`, locale)
          return (
            <CategoryPill
              key={category.id}
              name={category.title}
              slug={category.slug}
              href={href}
              resourceCount={category.resourceCount}
              countTranslations={countTranslations}
            />
          )
        })}
    </>
  )
}
