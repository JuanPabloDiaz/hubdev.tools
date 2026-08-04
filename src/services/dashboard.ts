import { cookies } from 'next/headers'
import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'

import { getEmbeddings } from '@/services/embeddings'

import { supabase } from './client'

const groq = createGroq()

export const getFeaturedResources = async () => {
  const [resourcesResult, translationsResult] = await Promise.all([
    supabase
      .from('resources')
      .select(
        `
    id, 
    title, 
    url, 
    image, 
    brief, 
    clicks,
    placeholder,
    categories!inner(
      slug,
      name
    )
  `
      )
      .order('clicks', { ascending: false })
      .limit(8),
    supabase.from('new_categories').select('slug, name_es')
  ])

  const { data, error } = resourcesResult

  if (error) {
    console.error(error)
    return
  }

  if (translationsResult.error) {
    console.error(translationsResult.error)
  }

  const translations = new Map(
    (translationsResult.data ?? []).map((category) => [category.slug, category.name_es])
  )

  const formattedData = data.map((item) => {
    const { categories: category, ...resource } = item
    return {
      ...resource,
      category: category.name,
      categoryEs: translations.get(category.slug ?? '') ?? null
    }
  })

  return formattedData
}

export const getAISuggestions = async () => {
  const cookieStore = await cookies()
  const history = cookieStore.get('history')
  if (!history) {
    return {
      data: []
    }
  }

  const historyValue = JSON.parse(history.value)

  const { text: query } = await generateText({
    model: groq('openai/gpt-oss-120b'),
    prompt: `You are a helpful assistant that summarizes the user's search history.
  Based on the following search history:
  ${historyValue.join('\n')}

  Your tasks are:

  - Create a clear, 10-word summary that captures the most relevant and recurring search themes. Ensure the summary is optimized for semantic search.
  - Start directly with the summary; avoid phrases like "the requirement."
  - Exclude any symbols, special characters, or unnecessary punctuation from the summary.`
  })

  const { data, error } = await getEmbeddings({
    input: query,
    count: 8
  })

  if (error || !data || data.length === 0) {
    return {
      error
    }
  }

  const categoryNames = [...new Set(data.map((resource) => resource.category).filter(Boolean))]
  const { data: taxonomyRows, error: taxonomyError } = await supabase
    .from('new_categories')
    .select('name, name_es')
    .in('name', categoryNames)

  if (taxonomyError) {
    console.error(taxonomyError)
  }

  const categoryTranslations = new Map(
    (taxonomyRows ?? []).map((category) => [category.name, category.name_es])
  )

  return {
    data: data.map((resource) => {
      return {
        ...resource,
        categoryEs: categoryTranslations.get(resource.category) ?? null
      }
    })
  }
}

export const getLatestResources = async () => {
  const [resourcesResult, translationsResult] = await Promise.all([
    supabase
      .from('resources')
      .select(
        `
    id, 
    title, 
    url, 
    image, 
    summary, 
    brief, 
    placeholder, 
    categories!inner(
      slug,
      name
    )
  `
      )
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('new_categories').select('slug, name_es')
  ])

  const { data, error } = resourcesResult

  if (error) {
    console.error(error)
    return
  }

  if (translationsResult.error) {
    console.error(translationsResult.error)
  }

  const translations = new Map(
    (translationsResult.data ?? []).map((category) => [category.slug, category.name_es])
  )

  const formattedData = data.map((item) => {
    const { categories: category, ...resource } = item
    return {
      ...resource,
      category: category.name,
      categoryEs: translations.get(category.slug ?? '') ?? null
    }
  })

  return formattedData
}

export const getFavoritesResources = async (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return []
  }

  const [resourcesResult, translationsResult] = await Promise.all([
    supabase
      .from('resources')
      .select(
        `
    id, 
    title, 
    url, 
    image, 
    summary, 
    brief, 
    placeholder, 
    categories!inner(
      slug,
      name
    )
  `
      )
      .in('id', ids),
    supabase.from('new_categories').select('slug, name_es')
  ])

  const { data, error } = resourcesResult

  if (error) {
    console.error(error)
    return []
  }

  if (translationsResult.error) {
    console.error(translationsResult.error)
  }

  const translations = new Map(
    (translationsResult.data ?? []).map((category) => [category.slug, category.name_es])
  )

  const formattedData = data.map((item) => {
    const { categories: category, ...resource } = item
    return {
      ...resource,
      category: category.name,
      categoryEs: translations.get(category.slug ?? '') ?? null
    }
  })

  return formattedData
}
