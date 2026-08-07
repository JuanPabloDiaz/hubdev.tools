'use client'

import { useEffect, useState } from 'react'
import { Check, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { CollectionAppearance } from '@/components/collection-appearance'
import { CollectionDetail } from '@/components/collection-detail'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/config'
import {
  formatMessage,
  getCollectionErrorMessage,
  type CollectionsTranslations
} from '@/i18n/messages'
import {
  MAX_COLLECTIONS,
  MAX_COLLECTION_NAME_LENGTH,
  MIN_COLLECTION_NAME_LENGTH,
  type Collection
} from '@/types/collection'
import { createCollection, deleteCollection, loadCollections } from '@/utils/collections-storage'

export function CollectionsOverview({
  locale,
  translations
}: {
  locale: Locale
  translations: CollectionsTranslations
}) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const canCreateCollection = name.trim().length >= MIN_COLLECTION_NAME_LENGTH
  const viewDetailsLabel = translations.view || (locale === 'es' ? 'Ver detalle' : 'View details')

  useEffect(() => {
    const result = loadCollections(translations.importedFavorites)
    if (result.success) {
      setCollections(result.collections)
    } else {
      toast.error(getCollectionErrorMessage(result.error, translations))
    }
    setIsReady(true)
  }, [translations])

  function handleCreate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateCollection) return

    const result = createCollection(name, undefined, translations.inbox)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }

    setCollections(result.collections)
    setName('')
    setIsCreating(false)
  }

  function handleDelete(collectionId: string) {
    const result = deleteCollection(collectionId)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }
    setCollections(result.collections)
    setConfirmingDeleteId(null)
    if (selectedCollectionId === collectionId) setSelectedCollectionId(null)
  }

  function handleCollectionUpdated(updatedCollection: Collection) {
    setCollections((currentCollections) =>
      currentCollections.map((collection) =>
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    )
  }

  return (
    <div
      className={
        selectedCollectionId
          ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)] xl:gap-5'
          : undefined
      }
    >
      <section
        aria-labelledby='collections-title'
        className={selectedCollectionId ? 'hidden min-w-0 xl:block' : undefined}
      >
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-2'>
            <h1
              id='collections-title'
              className='text-2xl font-semibold tracking-tight text-light-900 dark:text-white'
            >
              {translations.title}
            </h1>
            <p className='max-w-xl text-sm text-muted-foreground'>{translations.description}</p>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-xs tabular-nums text-muted-foreground'>
              {formatMessage(translations.limit, { count: collections.length })}
            </span>
            <Button
              type='button'
              size='sm'
              disabled={!isReady || collections.length >= MAX_COLLECTIONS}
              onClick={() => setIsCreating(true)}
              className='gap-2 rounded-lg shadow-sm'
            >
              <Plus className='size-4' />
              {translations.new}
            </Button>
          </div>
        </div>

        {isCreating ? (
          <form
            onSubmit={handleCreate}
            className='mt-5 flex max-w-xl flex-col gap-3 rounded-xl border border-light-700/70 bg-light-600/20 p-4 dark:border-neutral-800 dark:bg-neutral-900/50 sm:flex-row sm:items-end'
          >
            <div className='min-w-0 flex-1 space-y-1.5'>
              <label
                htmlFor='new-collection-name'
                className='text-xs font-medium text-muted-foreground'
              >
                {translations.nameLabel}
              </label>
              <input
                autoFocus
                id='new-collection-name'
                value={name}
                minLength={MIN_COLLECTION_NAME_LENGTH}
                maxLength={MAX_COLLECTION_NAME_LENGTH}
                onChange={(event) => setName(event.target.value)}
                placeholder={translations.namePlaceholder}
                className='h-10 w-full rounded-lg border border-light-700 bg-white px-3 text-sm outline-hidden focus:border-light-900 dark:border-neutral-700 dark:bg-[#111] dark:focus:border-violet-400'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsCreating(false)
                  setName('')
                }}
                className='rounded-lg border-light-700 hover:bg-light-600/60 dark:border-neutral-700 dark:hover:bg-neutral-800'
              >
                {translations.cancel}
              </Button>
              <Button
                type='submit'
                disabled={!canCreateCollection}
                className='max-w-full truncate rounded-lg'
              >
                {translations.create}
              </Button>
            </div>
          </form>
        ) : null}

        {!isReady ? (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 py-6'>
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className='h-40 animate-pulse rounded-xl border border-light-700/60 bg-light-600/20 dark:border-neutral-800 dark:bg-neutral-900'
              />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 py-6'>
            {collections.map((collection) => {
              const collectionName =
                collection.kind === 'inbox' ? translations.inbox : collection.name
              const countTemplate =
                collection.resourceIds.length === 1
                  ? translations.resourceCountSingular
                  : translations.resourceCountPlural
              const isConfirmingDelete = confirmingDeleteId === collection.id

              return (
                <article
                  key={collection.id}
                  className='relative flex min-h-48 flex-col rounded-xl border border-light-700/70 bg-light-600/20 p-4 transition-colors hover:bg-light-600/40 dark:border-neutral-800 dark:bg-[#111] dark:hover:bg-[#171717]'
                >
                  {isConfirmingDelete ? (
                    <div className='flex h-full flex-col justify-between gap-4'>
                      <p className='text-sm leading-6 text-muted-foreground'>
                        {translations.delete.question}
                      </p>
                      <div className='flex justify-end gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon-md'
                          onClick={() => setConfirmingDeleteId(null)}
                          className='rounded-lg border-light-700 hover:bg-light-600/60 dark:border-neutral-700 dark:hover:bg-neutral-800'
                          aria-label={translations.cancel}
                        >
                          <X className='size-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDelete(collection.id)}
                          className='gap-2 rounded-lg'
                        >
                          <Check className='size-4' />
                          {translations.delete.confirm}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex items-start justify-between gap-3'>
                        <CollectionAppearance
                          icon={collection.icon}
                          color={collection.color}
                        />
                        {collection.kind === 'custom' ? (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            onClick={() => setConfirmingDeleteId(collection.id)}
                            className='text-muted-foreground hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300'
                            aria-label={translations.delete.action}
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        ) : null}
                      </div>
                      <div className='mt-6 min-w-0'>
                        <h2 className='truncate font-semibold text-light-950 dark:text-white'>
                          {collectionName}
                        </h2>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {formatMessage(countTemplate, { count: collection.resourceIds.length })}
                        </p>
                      </div>
                      <Button
                        type='button'
                        variant='link'
                        size='xs'
                        onClick={() => {
                          setConfirmingDeleteId(null)
                          setSelectedCollectionId(collection.id)
                        }}
                        className='mt-auto min-w-0 max-w-full self-start px-0 text-sm text-light-950 underline decoration-light-700 hover:decoration-light-950 dark:text-neutral-200 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white'
                      >
                        <span className='truncate'>{viewDetailsLabel}</span>
                      </Button>
                    </>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
      {selectedCollectionId ? (
        <div className='min-w-0'>
          <CollectionDetail
            key={selectedCollectionId}
            collectionId={selectedCollectionId}
            locale={locale}
            translations={translations}
            onClose={() => setSelectedCollectionId(null)}
            onCollectionUpdated={handleCollectionUpdated}
          />
        </div>
      ) : null}
    </div>
  )
}
