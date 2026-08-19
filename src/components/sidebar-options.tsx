import { ListCategories } from './list-categories'
import { CategoryPill } from './category-pill'
import type { Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'
import { getLocalizedHref } from '@/i18n/routing'

function OptionHeader({ title }: { title: string }) {
  return (
    <div className='hidden md:flex h-9 items-center px-4'>
      <span className='font-normal text-light-800 dark:text-gray-400 text-sm'>{title}</span>
    </div>
  )
}

function HomeNav({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <CategoryPill
      name={dictionary.sidebar.home}
      slug='home'
      href={getLocalizedHref('/', locale)}
    />
  )
}

function Collections({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <CategoryPill
      name={dictionary.sidebar.collections}
      slug='collections'
      href={getLocalizedHref('/collections', locale)}
    />
  )
}

export async function SidebarOptions({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale)
  return (
    <div className='flex space-y-1 overflow-y-auto md:flex-col md:overflow-y-visible pt-0 px-0.5 md:px-0'>
      <HomeNav
        dictionary={dictionary}
        locale={locale}
      />
      <Collections
        dictionary={dictionary}
        locale={locale}
      />
      <OptionHeader title={dictionary.sidebar.categories} />
      <ListCategories
        locale={locale}
        countTranslations={dictionary.sidebar.count}
      />
    </div>
  )
}
