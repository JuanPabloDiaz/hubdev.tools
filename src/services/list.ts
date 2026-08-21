import type { Locale } from '@/i18n/config'
import type { CatalogResource, LocalizedCategory, LocalizedSubcategory } from '@/types/catalog'

import { supabase } from './client'

function mapCatalogResource(resource: {
  id: string
  title: string
  url: string
  image: string
  placeholder: string | null
  resources_translations: { brief: string }[]
}): CatalogResource {
  const [translation] = resource.resources_translations

  return {
    id: resource.id,
    title: resource.title,
    url: resource.url,
    image: resource.image,
    placeholder: resource.placeholder,
    brief: translation.brief
  }
}

type ResourcesPageOptions = {
  locale: Locale
  offset: number
  limit: number
  categorySlug?: string
  subcategorySlug?: string
}

export async function getResourcesPage({
  locale,
  offset,
  limit,
  categorySlug,
  subcategorySlug
}: ResourcesPageOptions): Promise<CatalogResource[] | undefined> {
  let query = supabase
    .from('new_resources')
    .select(
      `
      id,
      title,
      url,
      image,
      placeholder,
      resources_translations!inner(
        brief
      ),
      new_categories!new_resources_category_fk!inner(
        slug
      ),
      new_subcategories!new_resources_subcategory_fk!inner(
        slug
      )
    `
    )
    .eq('resources_translations.locale', locale)

  if (categorySlug) {
    query = query.eq('new_categories.slug', categorySlug)
  }

  if (subcategorySlug) {
    query = query.eq('new_subcategories.slug', subcategorySlug)
  }

  const { data, error } = await query
    .order('title', { ascending: true })
    .order('id', { ascending: true })
    .range(offset, offset + limit)

  if (error) {
    console.error(error)
    return
  }

  return data.map(mapCatalogResource)
}

export async function getTopRankedResources({
  locale,
  limit
}: {
  locale: Locale
  limit: number
}): Promise<CatalogResource[] | undefined> {
  const { data, error } = await supabase
    .from('new_resources')
    .select(
      `
      id,
      title,
      url,
      image,
      placeholder,
      resources_translations!inner(
        brief
      )
    `
    )
    .eq('resources_translations.locale', locale)
    .order('clicks', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return
  }

  return data.map(mapCatalogResource)
}

export async function getRecentResources({
  locale,
  limit
}: {
  locale: Locale
  limit: number
}): Promise<CatalogResource[] | undefined> {
  const { data, error } = await supabase
    .from('new_resources')
    .select(
      `
      id,
      title,
      url,
      image,
      placeholder,
      resources_translations!inner(
        brief
      )
    `
    )
    .eq('resources_translations.locale', locale)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return
  }

  return data.map(mapCatalogResource)
}

export async function getRecentResourcesPage({
  locale,
  offset,
  limit
}: {
  locale: Locale
  offset: number
  limit: number
}): Promise<CatalogResource[] | undefined> {
  const { data, error } = await supabase
    .from('new_resources')
    .select(
      `
      id,
      title,
      url,
      image,
      placeholder,
      resources_translations!inner(
        brief
      )
    `
    )
    .eq('resources_translations.locale', locale)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit)

  if (error) {
    console.error(error)
    return
  }

  return data.map(mapCatalogResource)
}

export async function getCategories(locale: Locale) {
  const { data, error } = await supabase
    .from('new_categories')
    .select(
      `
      id,
      slug,
      category_translations!inner(
        title,
        description
      ),
      new_resources!new_resources_category_fk(count)
    `
    )
    .eq('isActive', true)
    .eq('category_translations.locale', locale)

  if (error) {
    console.error(error)
    return
  }

  return data
    .map((category) => {
      const [translation] = category.category_translations

      return {
        id: category.id,
        slug: category.slug,
        title: translation.title,
        description: translation.description,
        resourceCount: category.new_resources[0]?.count ?? 0
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title, locale))
}

// Fetches a localized category for the hero, metadata, and OG/Twitter images.
export async function getCategoryDetails({
  slug,
  locale
}: {
  slug: string
  locale: Locale
}): Promise<LocalizedCategory | undefined> {
  const { data, error } = await supabase
    .from('new_categories')
    .select(
      `
      id,
      slug,
      category_translations!inner(
        title,
        description
      )
    `
    )
    .eq('slug', slug)
    .eq('isActive', true)
    .eq('category_translations.locale', locale)
    .maybeSingle()

  if (error) {
    console.error(error)
    return
  }

  if (!data) return
  const [translation] = data.category_translations

  return {
    id: data.id,
    slug: data.slug,
    title: translation.title,
    description: translation.description
  }
}

// Lists localized subcategories for filters and CategoryContent validation.
export async function getSubcategoriesByCategorySlug({
  categorySlug,
  locale
}: {
  categorySlug: string
  locale: Locale
}): Promise<LocalizedSubcategory[] | undefined> {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      id,
      slug,
      subcategory_translations!inner(
        title
      ),
      new_categories!new_subcategories_category_fk!inner(
        slug
      )
    `
    )
    .eq('isActive', true)
    .eq('new_categories.slug', categorySlug)
    .eq('subcategory_translations.locale', locale)

  if (error) {
    console.error(error)
    return
  }

  return data
    .map((subcategory) => {
      const [translation] = subcategory.subcategory_translations

      return {
        id: subcategory.id,
        slug: subcategory.slug,
        title: translation.title
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title, locale))
}

// Fetches a subcategory and its category for the subcategory route metadata.
export async function getSubcategoryDetails({
  categorySlug,
  subcategorySlug,
  locale
}: {
  categorySlug: string
  subcategorySlug: string
  locale: Locale
}) {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      id,
      slug,
      subcategory_translations!inner(
        title
      ),
      new_categories!new_subcategories_category_fk!inner(
        id,
        slug,
        category_translations!inner(
          title,
          description
        )
      )
    `
    )
    .eq('isActive', true)
    .eq('slug', subcategorySlug)
    .eq('new_categories.slug', categorySlug)
    .eq('subcategory_translations.locale', locale)
    .eq('new_categories.category_translations.locale', locale)
    .maybeSingle()

  if (error) {
    console.error(error)
    return
  }

  if (!data) return
  const [translation] = data.subcategory_translations
  const category = data.new_categories
  const [categoryTranslation] = category.category_translations

  return {
    id: data.id,
    slug: data.slug,
    title: translation.title,
    category: {
      id: category.id,
      slug: category.slug,
      title: categoryTranslation.title,
      description: categoryTranslation.description
    }
  }
}

export async function getTaxonomyPaths() {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      slug,
      new_categories!new_subcategories_category_fk!inner(
        slug
      ),
      new_resources!new_resources_subcategory_fk(count)
    `
    )
    .eq('isActive', true)
    .eq('new_categories.isActive', true)

  if (error) {
    console.error(error)
    return
  }

  return data
    .filter((subcategory) => (subcategory.new_resources[0]?.count ?? 0) > 0)
    .map((subcategory) => ({
      categorySlug: subcategory.new_categories.slug,
      subcategorySlug: subcategory.slug
    }))
}

// Compatibility for the untouched legacy search service.
export async function getData({ from, to }: { from: number; to: number }) {
  const resources = await getResourcesPage({
    locale: 'en',
    offset: from,
    limit: to - from + 1
  })

  return resources?.map((resource) => ({
    ...resource,
    summary: resource.brief,
    new_categories: {
      name: '',
      name_es: null
    }
  }))
}

// Compatibility for the untouched legacy search service.
export async function getResourcesByCategorySlug({
  from,
  to,
  slug,
  subcategory
}: {
  from: number
  to: number
  slug: string
  subcategory?: string
}) {
  const resources = await getResourcesPage({
    locale: 'en',
    offset: from,
    limit: to - from + 1,
    categorySlug: slug,
    subcategorySlug: subcategory
  })

  return resources?.map((resource) => ({
    ...resource,
    summary: resource.brief,
    new_categories: {
      slug,
      name: '',
      name_es: null
    },
    new_subcategories: subcategory ? { slug: subcategory } : null
  }))
}
