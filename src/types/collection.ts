export const COLLECTION_ICON_KEYS = [
  'layers',
  'code',
  'sparkles',
  'book',
  'flask',
  'bookmark'
] as const

export const COLLECTION_COLOR_KEYS = ['violet', 'emerald', 'blue', 'amber', 'rose', 'cyan'] as const

export const MAX_COLLECTIONS = 20
export const MAX_RESOURCES_PER_COLLECTION = 15
export const MIN_COLLECTION_NAME_LENGTH = 3
export const MAX_COLLECTION_NAME_LENGTH = 30

export type CollectionIconKey = (typeof COLLECTION_ICON_KEYS)[number]
export type CollectionColorKey = (typeof COLLECTION_COLOR_KEYS)[number]

export type Collection = {
  id: string
  kind: 'inbox' | 'custom'
  name: string
  icon: CollectionIconKey
  color: CollectionColorKey
  resourceIds: string[]
  createdAt: string
  updatedAt: string
}

export type CollectionsState = {
  version: 1
  collections: Collection[]
  legacyFavoritesMigrated: boolean
}

export type CollectionResource = {
  id: string
  title: string
  url: string
  image: string
  placeholder: string | null
  brief: string
  category: string
}

export type CollectionMutationError =
  | 'collection-full'
  | 'duplicate-name'
  | 'maximum-collections'
  | 'not-found'
  | 'protected'
  | 'storage'

export type CollectionMutationResult =
  | { success: true; collections: Collection[] }
  | { success: false; error: CollectionMutationError }
