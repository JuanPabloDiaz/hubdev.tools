import { QueryData } from '@supabase/supabase-js'

import { supabase } from './client'

const resourcesWithCategoryQuery = supabase.from('new_resources').select(`
    id, 
    title, 
    url, 
    image, 
    summary, 
    brief,
    placeholder, 
    new_categories!new_resources_category_fk(
      name
    )
  `)

type ResourcesWithCategory = QueryData<typeof resourcesWithCategoryQuery>

export const getData = async ({ from, to }: { from: number; to: number }) => {
  const { data, error } = await resourcesWithCategoryQuery.range(from, to).order('created_at', {
    ascending: false
  })
  if (error) {
    console.error(error)
    return
  }
  const resourcesWithCategory: ResourcesWithCategory = data
  return resourcesWithCategory
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('new_categories')
    .select(
      `
      id,
      name,
      slug,
      emoji,
      new_resources!new_resources_category_fk(count)
    `
    )
    .eq('isActive', true)
    .order('name')

  if (error) {
    console.error(error)
    return
  }

  return data.map(({ new_resources, ...category }) => ({
    ...category,
    resourceCount: new_resources[0]?.count ?? 0
  }))
}

export const getCategoryDetails = async ({ slug }: { slug: string }) => {
  const { data, error } = await supabase
    .from('new_categories')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .eq('isActive', true)
    .maybeSingle()

  if (error) {
    console.error(error)
    return
  }

  return data
}

export const getSubcategoriesByCategorySlug = async ({
  categorySlug
}: {
  categorySlug: string
}) => {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      id,
      name,
      slug,
      new_categories!new_subcategories_category_fk!inner(
        slug
      )
    `
    )
    .eq('isActive', true)
    .eq('new_categories.slug', categorySlug)
    .order('name')

  if (error) {
    console.error(error)
    return
  }

  return data.map(({ id, name, slug }) => ({
    id,
    name,
    slug
  }))
}

export const getSubcategoryDetails = async ({
  categorySlug,
  subcategorySlug
}: {
  categorySlug: string
  subcategorySlug: string
}) => {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      id,
      name,
      slug,
      description,
      new_categories!new_subcategories_category_fk!inner(
        name,
        slug
      )
    `
    )
    .eq('isActive', true)
    .eq('slug', subcategorySlug)
    .eq('new_categories.slug', categorySlug)
    .maybeSingle()

  if (error) {
    console.error(error)
    return
  }

  if (!data) return

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    category: data.new_categories
  }
}

export const getTaxonomyPaths = async () => {
  const { data, error } = await supabase
    .from('new_subcategories')
    .select(
      `
      slug,
      new_categories!new_subcategories_category_fk!inner(
        slug
      )
    `
    )
    .eq('isActive', true)
    .eq('new_categories.isActive', true)

  if (error) {
    console.error(error)
    return
  }

  return data.map((subcategory) => ({
    categorySlug: subcategory.new_categories.slug,
    subcategorySlug: subcategory.slug
  }))
}

export const getResourcesByCategorySlug = async ({
  from,
  to,
  slug,
  subcategory
}: {
  from: number
  to: number
  slug: string
  subcategory?: string
}) => {
  if (subcategory) {
    const { data, error } = await supabase
      .from('new_resources')
      .select(
        `
        id,
        title,
        url,
        image,
        summary,
        brief,
        placeholder,
        new_categories!new_resources_category_fk!inner(
          slug,
          name
        ),
        new_subcategories!new_resources_subcategory_fk!inner(
          slug
        )
      `
      )
      .eq('new_categories.slug', slug)
      .eq('new_subcategories.slug', subcategory)
      .order('title')
      .range(from, to)

    if (error) {
      console.error(error)
      return
    }

    return data
  }

  const { data, error } = await supabase
    .from('new_resources')
    .select(
      `
      id,
      title,
      url,
      image,
      summary,
      brief,
      placeholder,
      new_categories!new_resources_category_fk!inner(
        slug,
        name
      ),
      new_subcategories!new_resources_subcategory_fk(
        slug
      )
    `
    )
    .eq('new_categories.slug', slug)
    .order('title')
    .range(from, to)

  if (error) {
    console.error(error)
    return
  }

  return data
}
