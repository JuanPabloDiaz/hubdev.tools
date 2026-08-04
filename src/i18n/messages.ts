import type { Dictionary } from './dictionaries'

export type LanguageTranslations = Pick<Dictionary['header'], 'language' | 'english' | 'spanish'>

export type ThemeTranslations = Dictionary['theme']

export type SidebarCountTranslations = Dictionary['sidebar']['count']

export type SearchToolbarTranslations = Dictionary['search']['toolbar']

export type NoResultsTranslations = Dictionary['search']['databaseEmpty']

export type ResourceTranslations = Dictionary['resources']

export type FavoriteTranslations = Dictionary['favorites']['errors']

export type SubmitTranslations = Dictionary['submit']

export type NotFoundTranslations = Dictionary['notFound']

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  )
}
