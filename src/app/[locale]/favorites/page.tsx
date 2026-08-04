import { Suspense } from 'react'

import { getFavoritesResources } from '@/services/dashboard'
import { listFavorites } from '@/actions/favorites'

import { Container } from '@/components/container'
import { SpecialCard } from '@/components/special-card'
import { SectionHeader } from '@/components/section-header'
import { LoadingResources } from '@/components/loading'
import { NoFavorites } from '@/components/no-favorites'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'
import { getAlternateUrls, getLocalizedHref } from '@/i18n/routing'
import { getLocalizedName } from '@/i18n/taxonomy'

type FavoritesPageProps = {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: FavoritesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)
  return {
    title: dictionary.metadata.favorites,
    description: dictionary.metadata.favoritesDescription,
    alternates: getAlternateUrls(getLocalizedHref('/favorites', locale), locale)
  }
}

async function ListFavoritesComp({
  locale,
  dictionary
}: {
  locale: Locale
  dictionary: Dictionary
}) {
  const favoriteIds = await listFavorites()
  const favorites = favoriteIds.length > 0 ? await getFavoritesResources(favoriteIds) : []

  if (favorites.length === 0) {
    return (
      <NoFavorites
        title={dictionary.favorites.empty.title}
        description={dictionary.favorites.empty.description}
        exploreLabel={dictionary.favorites.empty.explore}
        href={getLocalizedHref('/', locale)}
      />
    )
  }

  const favoriteTranslations = dictionary.favorites.errors

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
      {favorites.map((resource, index) => (
        <SpecialCard
          key={resource.id}
          resource={{
            id: resource.id,
            name: resource.title,
            category: getLocalizedName(
              { name: resource.category, name_es: resource.categoryEs },
              locale
            ),
            brief: resource.brief ?? resource.summary,
            url: resource.url,
            image: resource.image,
            placeholder: resource.placeholder ?? '',
            order: index,
            clicks: 0
          }}
          isFavorite={true}
          locale={locale}
          resourceTranslations={dictionary.resources}
          favoriteTranslations={favoriteTranslations}
        />
      ))}
    </div>
  )
}

export default async function Page({ params }: FavoritesPageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return null

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)

  return (
    <Container>
      <div className='h-auto w-full shrink-0 rounded-md'>
        <SectionHeader
          title={dictionary.metadata.favorites}
          description={dictionary.metadata.favoritesDescription}
        />
        <Suspense fallback={<LoadingResources />}>
          <ListFavoritesComp
            locale={locale}
            dictionary={dictionary}
          />
        </Suspense>
      </div>
    </Container>
  )
}
