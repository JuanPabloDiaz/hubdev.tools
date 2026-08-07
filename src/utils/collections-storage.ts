import {
  COLLECTION_COLOR_KEYS,
  COLLECTION_ICON_KEYS,
  MAX_COLLECTIONS,
  MAX_RESOURCES_PER_COLLECTION,
  type Collection,
  type CollectionMutationResult,
  type CollectionsState
} from '@/types/collection'

const STORAGE_KEY = 'hubdev.collections.v1'
const LEGACY_COOKIE_NAME = 'favorites'

type StateReadResult =
  | { success: true; state: CollectionsState; serialized: string | null }
  | { success: false }

function createInbox(now: string): Collection {
  return {
    id: crypto.randomUUID(),
    kind: 'inbox',
    name: 'Inbox',
    icon: 'bookmark',
    color: 'violet',
    resourceIds: [],
    createdAt: now,
    updatedAt: now
  }
}

function createInitialState(): CollectionsState {
  return {
    version: 1,
    collections: [createInbox(new Date().toISOString())],
    legacyFavoritesMigrated: false
  }
}

function isCollection(value: unknown): value is Collection {
  if (!value || typeof value !== 'object') return false

  const collection = value as Partial<Collection>
  return (
    typeof collection.id === 'string' &&
    (collection.kind === 'inbox' || collection.kind === 'custom') &&
    typeof collection.name === 'string' &&
    COLLECTION_ICON_KEYS.some((icon) => icon === collection.icon) &&
    COLLECTION_COLOR_KEYS.some((color) => color === collection.color) &&
    Array.isArray(collection.resourceIds) &&
    collection.resourceIds.every((id) => typeof id === 'string') &&
    typeof collection.createdAt === 'string' &&
    typeof collection.updatedAt === 'string'
  )
}

function normalizeState(value: unknown): CollectionsState {
  if (!value || typeof value !== 'object') return createInitialState()

  const candidate = value as Partial<CollectionsState>
  if (candidate.version !== 1 || !Array.isArray(candidate.collections)) {
    return createInitialState()
  }

  const collections = candidate.collections
    .filter(isCollection)
    .slice(0, MAX_COLLECTIONS)
    .map((collection) => ({
      ...collection,
      resourceIds: [...new Set(collection.resourceIds)].slice(0, MAX_RESOURCES_PER_COLLECTION)
    }))

  if (!collections.some((collection) => collection.kind === 'inbox')) {
    collections.unshift(createInbox(new Date().toISOString()))
  }

  return {
    version: 1,
    collections: collections.slice(0, MAX_COLLECTIONS),
    legacyFavoritesMigrated: candidate.legacyFavoritesMigrated === true
  }
}

function readState(): StateReadResult {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return { success: true, state: createInitialState(), serialized }
    }

    try {
      return {
        success: true,
        state: normalizeState(JSON.parse(serialized) as unknown),
        serialized
      }
    } catch {
      return { success: true, state: createInitialState(), serialized }
    }
  } catch {
    return { success: false }
  }
}

function persistState(state: CollectionsState): CollectionMutationResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return { success: true, collections: state.collections }
  } catch {
    return { success: false, error: 'storage' }
  }
}

// Legacy method
function readLegacyFavorites() {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${LEGACY_COOKIE_NAME}=`))

  if (!cookie) return []

  try {
    const value = decodeURIComponent(cookie.slice(LEGACY_COOKIE_NAME.length + 1))
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((item): item is string => typeof item === 'string'))]
      : []
  } catch {
    return []
  }
}

// Legacy method
function deleteLegacyFavoritesCookie() {
  document.cookie = `${LEGACY_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
}

// Legacy method
function migrateLegacyFavorites(state: CollectionsState, importedFavoritesLabel: string) {
  if (state.legacyFavoritesMigrated) return state

  const existingIds = new Set(state.collections.flatMap((collection) => collection.resourceIds))
  const legacyIds = readLegacyFavorites().filter((id) => !existingIds.has(id))
  const collections = state.collections.map((collection) => ({ ...collection }))
  const inboxIndex = collections.findIndex((collection) => collection.kind === 'inbox')
  const now = new Date().toISOString()
  let offset = 0

  if (inboxIndex >= 0 && legacyIds.length > 0) {
    const inbox = collections[inboxIndex]
    const capacity = MAX_RESOURCES_PER_COLLECTION - inbox.resourceIds.length
    const importedIds = legacyIds.slice(0, capacity)
    collections[inboxIndex] = {
      ...inbox,
      resourceIds: inbox.resourceIds.concat(importedIds),
      updatedAt: now
    }
    offset = importedIds.length
  }

  let importedCollectionNumber = 2
  let customCollectionIndex = collections.filter(
    (collection) => collection.kind === 'custom'
  ).length

  while (offset < legacyIds.length && collections.length < MAX_COLLECTIONS) {
    const resourceIds = legacyIds.slice(offset, offset + MAX_RESOURCES_PER_COLLECTION)

    collections.push({
      id: crypto.randomUUID(),
      kind: 'custom',
      name: `${importedFavoritesLabel} ${importedCollectionNumber}`,
      icon: COLLECTION_ICON_KEYS[customCollectionIndex % COLLECTION_ICON_KEYS.length],
      color: COLLECTION_COLOR_KEYS[customCollectionIndex % COLLECTION_COLOR_KEYS.length],
      resourceIds,
      createdAt: now,
      updatedAt: now
    })

    offset += resourceIds.length
    importedCollectionNumber += 1
    customCollectionIndex += 1
  }

  return {
    version: 1,
    collections,
    legacyFavoritesMigrated: true
  } satisfies CollectionsState
}

export function loadCollections(importedFavoritesLabel: string): CollectionMutationResult {
  const result = readState()
  if (!result.success) return { success: false, error: 'storage' }

  const shouldDeleteLegacyCookie = !result.state.legacyFavoritesMigrated
  const state = migrateLegacyFavorites(result.state, importedFavoritesLabel)
  const serializedState = JSON.stringify(state)

  if (result.serialized !== serializedState) {
    const persisted = persistState(state)
    if (!persisted.success) return persisted
  }

  if (shouldDeleteLegacyCookie) deleteLegacyFavoritesCookie()
  return { success: true, collections: state.collections }
}

export function createCollection(
  name: string,
  resourceId: string | undefined,
  inboxName: string
): CollectionMutationResult {
  const normalizedName = name.trim().replace(/\s+/g, ' ')
  const result = readState()
  if (!result.success) return { success: false, error: 'storage' }
  const { state } = result

  if (state.collections.length >= MAX_COLLECTIONS) {
    return { success: false, error: 'maximum-collections' }
  }

  const normalizedNames = state.collections.map((collection) =>
    (collection.kind === 'inbox' ? inboxName : collection.name).toLocaleLowerCase()
  )
  if (normalizedNames.includes(normalizedName.toLocaleLowerCase())) {
    return { success: false, error: 'duplicate-name' }
  }

  const customCollectionCount = state.collections.filter(
    (collection) => collection.kind === 'custom'
  ).length
  const now = new Date().toISOString()
  const collection: Collection = {
    id: crypto.randomUUID(),
    kind: 'custom',
    name: normalizedName,
    icon: COLLECTION_ICON_KEYS[customCollectionCount % COLLECTION_ICON_KEYS.length],
    color: COLLECTION_COLOR_KEYS[customCollectionCount % COLLECTION_COLOR_KEYS.length],
    resourceIds: resourceId ? [resourceId] : [],
    createdAt: now,
    updatedAt: now
  }

  return persistState({
    ...state,
    collections: state.collections.concat(collection)
  })
}

export function deleteCollection(collectionId: string): CollectionMutationResult {
  const result = readState()
  if (!result.success) return { success: false, error: 'storage' }

  const collection = result.state.collections.find((item) => item.id === collectionId)
  if (!collection) return { success: false, error: 'not-found' }
  if (collection.kind === 'inbox') return { success: false, error: 'protected' }

  return persistState({
    ...result.state,
    collections: result.state.collections.filter((item) => item.id !== collectionId)
  })
}

export function toggleCollectionResource(
  collectionId: string,
  resourceId: string
): CollectionMutationResult {
  const result = readState()
  if (!result.success) return { success: false, error: 'storage' }

  const collection = result.state.collections.find((item) => item.id === collectionId)
  if (!collection) return { success: false, error: 'not-found' }

  const containsResource = collection.resourceIds.includes(resourceId)
  if (!containsResource && collection.resourceIds.length >= MAX_RESOURCES_PER_COLLECTION) {
    return { success: false, error: 'collection-full' }
  }

  const now = new Date().toISOString()
  return persistState({
    ...result.state,
    collections: result.state.collections.map((item) =>
      item.id === collectionId
        ? {
            ...item,
            resourceIds: containsResource
              ? item.resourceIds.filter((id) => id !== resourceId)
              : item.resourceIds.concat(resourceId),
            updatedAt: now
          }
        : item
    )
  })
}

export function removeCollectionResource(
  collectionId: string,
  resourceId: string
): CollectionMutationResult {
  const result = readState()
  if (!result.success) return { success: false, error: 'storage' }

  const collection = result.state.collections.find((item) => item.id === collectionId)
  if (!collection) return { success: false, error: 'not-found' }
  if (!collection.resourceIds.includes(resourceId)) {
    return { success: true, collections: result.state.collections }
  }

  return persistState({
    ...result.state,
    collections: result.state.collections.map((item) =>
      item.id === collectionId
        ? {
            ...item,
            resourceIds: item.resourceIds.filter((id) => id !== resourceId),
            updatedAt: new Date().toISOString()
          }
        : item
    )
  })
}
