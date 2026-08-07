import type { Dictionary } from './dictionaries'
import type { CollectionMutationError } from '@/types/collection'

export type LanguageTranslations = Pick<Dictionary['header'], 'language' | 'english' | 'spanish'>

export type ThemeTranslations = Dictionary['theme']

export type SidebarCountTranslations = Dictionary['sidebar']['count']

export type SearchToolbarTranslations = Dictionary['search']['toolbar']

export type NoResultsTranslations = Dictionary['search']['databaseEmpty']

export type ResourceTranslations = Dictionary['resources']

export type CollectionsTranslations = Dictionary['collections']

const collectionErrorKeys = {
  'collection-full': 'collectionFull',
  'duplicate-name': 'duplicateName',
  'maximum-collections': 'maximum',
  'not-found': 'notFound',
  protected: 'notFound',
  storage: 'storage'
} satisfies Record<CollectionMutationError, keyof CollectionsTranslations['errors']>

export function getCollectionErrorMessage(
  error: CollectionMutationError,
  translations: CollectionsTranslations
) {
  return translations.errors[collectionErrorKeys[error]]
}

export type SubmitTranslations = Dictionary['submit']

export type NotFoundTranslations = Dictionary['notFound']

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  )
}
