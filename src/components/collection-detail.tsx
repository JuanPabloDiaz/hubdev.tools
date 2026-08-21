'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, BookmarkX, X } from 'lucide-react'
import { toast } from 'sonner'

import { listCollectionResources } from '@/actions/collections'
import { CollectionAppearance } from '@/components/collection-appearance'
import { Button } from '@/components/ui/button'
import { DEFAULT_BLUR_DATA_URL, HREF_PREFIX } from '@/constants'
import type { Locale } from '@/i18n/config'
import {
  formatMessage,
  getCollectionErrorMessage,
  type CollectionsTranslations
} from '@/i18n/messages'
import type { Collection, CollectionResource } from '@/types/collection'
import { loadCollections, removeCollectionResource } from '@/utils/collections-storage'

type CollectionRow =
  | { status: 'available'; resource: CollectionResource }
  | { status: 'unavailable'; resourceId: string }

function mapCollectionRows(resourceIds: string[], resources: CollectionResource[]) {
  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]))

  return resourceIds.map((resourceId): CollectionRow => {
    const resource = resourcesById.get(resourceId)
    return resource ? { status: 'available', resource } : { status: 'unavailable', resourceId }
  })
}

async function loadCollectionDetail({
  collectionId,
  locale,
  importedFavoritesLabel
}: {
  collectionId: string
  locale: Locale
  importedFavoritesLabel: string
}) {
  const collectionsResult = loadCollections(importedFavoritesLabel)
  if (!collectionsResult.success) return collectionsResult

  const collection = collectionsResult.collections.find((item) => item.id === collectionId) ?? null

  if (!collection || collection.resourceIds.length === 0) {
    return { success: true as const, collection, rows: [] }
  }

  const resourcesResult = await listCollectionResources({
    ids: collection.resourceIds,
    locale
  })
  const resources = 'resources' in resourcesResult ? resourcesResult.resources : []

  return {
    success: true as const,
    collection,
    rows: mapCollectionRows(collection.resourceIds, resources)
  }
}

function UnavailableCollectionItem({
  resourceId,
  translations,
  onRemove
}: {
  resourceId: string
  translations: CollectionsTranslations
  onRemove: (resourceId: string) => void
}) {
  return (
    <li className='flex min-h-16 items-center gap-3 px-3 py-2'>
      <div className='grid size-11 shrink-0 place-items-center rounded-md bg-light-600 text-muted-foreground dark:bg-neutral-900'>
        <BookmarkX className='size-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium'>{translations.detail.unavailable}</p>
        <p className='truncate text-xs text-muted-foreground'>
          {translations.detail.unavailableDescription}
        </p>
      </div>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        onClick={() => onRemove(resourceId)}
        className='text-muted-foreground hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300'
        aria-label={translations.detail.remove}
      >
        <X className='size-4' />
      </Button>
    </li>
  )
}

function CollectionResourceItem({
  resource,
  translations,
  onRemove
}: {
  resource: CollectionResource
  translations: CollectionsTranslations
  onRemove: (resourceId: string) => void
}) {
  return (
    <li className='flex min-h-16 items-center gap-3 px-3 py-2 transition-colors hover:bg-light-600/35 dark:hover:bg-neutral-900/70'>
      <div className='relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-light-700 bg-white dark:border-neutral-800 dark:bg-neutral-950'>
        <Image
          src={resource.image}
          alt=''
          fill
          sizes='64px'
          className='object-cover'
          placeholder='blur'
          blurDataURL={resource.placeholder || DEFAULT_BLUR_DATA_URL}
        />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium text-light-950 dark:text-white'>
          {resource.title}
        </p>
        <p className='truncate text-xs text-muted-foreground'>{resource.brief}</p>
      </div>
      <span className='hidden max-w-28 truncate text-xs text-muted-foreground 2xl:block'>
        {resource.category}
      </span>
      <Button
        asChild
        variant='ghost'
        size='icon-sm'
        className='shrink-0 text-blue-700 hover:bg-blue-100 dark:text-anchor dark:hover:bg-blue-500/10'
      >
        <a
          href={`${HREF_PREFIX}${resource.url}`}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={translations.detail.open}
        >
          <ArrowUpRight className='size-4' />
        </a>
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        onClick={() => onRemove(resource.id)}
        className='shrink-0 text-muted-foreground hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300'
        aria-label={translations.detail.remove}
      >
        <X className='size-4' />
      </Button>
    </li>
  )
}

export function CollectionDetail({
  collectionId,
  locale,
  translations,
  onClose,
  onCollectionUpdated
}: {
  collectionId: string
  locale: Locale
  translations: CollectionsTranslations
  onClose: () => void
  onCollectionUpdated: (collection: Collection) => void
}) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [rows, setRows] = useState<CollectionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadDetail() {
      setIsLoading(true)
      const result = await loadCollectionDetail({
        collectionId,
        locale,
        importedFavoritesLabel: translations.importedFavorites
      })

      if (isCancelled) return

      if (!result.success) {
        toast.error(getCollectionErrorMessage(result.error, translations))
        setCollection(null)
        setRows([])
      } else {
        setCollection(result.collection)
        setRows(result.rows)
      }
      setIsLoading(false)
    }

    loadDetail()

    return () => {
      isCancelled = true
    }
  }, [collectionId, locale, translations])

  function handleRemove(resourceId: string) {
    if (!collection) return

    const result = removeCollectionResource(collection.id, resourceId)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }

    const updatedCollection = result.collections.find((item) => item.id === collection.id)
    if (!updatedCollection) return

    setCollection(updatedCollection)
    onCollectionUpdated(updatedCollection)
    setRows((currentRows) =>
      currentRows.filter((row) =>
        row.status === 'available' ? row.resource.id !== resourceId : row.resourceId !== resourceId
      )
    )
  }

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <div className='h-24 animate-pulse rounded-xl bg-light-600/30 dark:bg-neutral-900' />
        <div className='h-64 animate-pulse rounded-xl bg-light-600/30 dark:bg-neutral-900' />
      </div>
    )
  }

  if (!collection) {
    return (
      <section className='rounded-xl border border-light-700/70 p-8 text-center dark:border-neutral-800'>
        <h1 className='font-semibold'>{translations.errors.notFound}</h1>
        <Button
          type='button'
          variant='link'
          size='sm'
          onClick={onClose}
          className='mt-4 text-blue-700 dark:text-anchor'
        >
          {translations.detail.back}
        </Button>
      </section>
    )
  }

  const collectionName = collection.kind === 'inbox' ? translations.inbox : collection.name
  const countTemplate =
    collection.resourceIds.length === 1
      ? translations.resourceCountSingular
      : translations.resourceCountPlural

  return (
    <section
      aria-labelledby={`collection-${collection.id}-title`}
      className='rounded-xl border border-light-700/70 bg-stone-50 p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111] sm:p-5'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <CollectionAppearance
            icon={collection.icon}
            color={collection.color}
          />
          <div className='min-w-0'>
            <h1
              id={`collection-${collection.id}-title`}
              className='truncate text-xl font-semibold text-light-950 dark:text-white'
            >
              {collectionName}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {formatMessage(countTemplate, { count: collection.resourceIds.length })}
            </p>
          </div>
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon-md'
          onClick={onClose}
          aria-label={translations.detail.back}
          className='shrink-0 rounded-lg border-light-700 hover:bg-light-600/60 dark:border-neutral-700 dark:hover:bg-neutral-800'
        >
          <X className='size-4' />
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
          <BookmarkX className='size-9 text-muted-foreground' />
          <h2 className='mt-4 font-semibold'>{translations.detail.emptyTitle}</h2>
          <p className='mt-2 max-w-sm text-sm leading-6 text-muted-foreground'>
            {translations.detail.emptyDescription}
          </p>
        </div>
      ) : (
        <ul className='mt-5 divide-y divide-light-700/60 overflow-hidden rounded-lg border border-light-700/70 dark:divide-neutral-800 dark:border-neutral-800'>
          {rows.map((row) => {
            /* in case a resource is removed from database or no translation was found for that resource, user will see an unavailable message */
            if (row.status === 'unavailable') {
              return (
                <UnavailableCollectionItem
                  key={row.resourceId}
                  resourceId={row.resourceId}
                  translations={translations}
                  onRemove={handleRemove}
                />
              )
            }

            return (
              <CollectionResourceItem
                key={row.resource.id}
                resource={row.resource}
                translations={translations}
                onRemove={handleRemove}
              />
            )
          })}
        </ul>
      )}
    </section>
  )
}
