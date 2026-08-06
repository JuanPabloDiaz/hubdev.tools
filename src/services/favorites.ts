import type { Locale } from '@/i18n/config'

import { supabase } from './client'

export async function getFavoritesResources(ids: string[], locale: Locale) {
  if (ids.length === 0) {
    return []
  }

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
      ),
      new_categories!new_resources_category_fk!inner(
        category_translations!inner(
          title
        )
      )
    `
    )
    .eq('resources_translations.locale', locale)
    .eq('new_categories.category_translations.locale', locale)
    .in('id', ids)

  if (error) {
    console.error(error)
    return []
  }

  return data.map((resource) => {
    const translation = resource.resources_translations[0]
    const categoryTranslation = resource.new_categories.category_translations[0]

    return {
      id: resource.id,
      title: resource.title,
      url: resource.url,
      image: resource.image,
      placeholder: resource.placeholder,
      brief: translation.brief,
      category: categoryTranslation.title
    }
  })
}
