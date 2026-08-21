'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Check, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  formatMessage,
  getCollectionErrorMessage,
  type CollectionsTranslations
} from '@/i18n/messages'
import {
  MAX_COLLECTIONS,
  MAX_COLLECTION_NAME_LENGTH,
  MAX_RESOURCES_PER_COLLECTION,
  MIN_COLLECTION_NAME_LENGTH,
  type Collection
} from '@/types/collection'
import {
  createCollection,
  loadCollections,
  toggleCollectionResource
} from '@/utils/collections-storage'
import { cn } from '@/utils/styles'

export function CollectionBookmarkButton({
  resourceId,
  title,
  translations
}: {
  resourceId: string
  title: string
  translations: CollectionsTranslations
}) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const canCreateCollection = name.trim().length >= MIN_COLLECTION_NAME_LENGTH

  useEffect(() => {
    const result = loadCollections(translations.importedFavorites)
    if (result.success) {
      setCollections(result.collections)
    } else {
      toast.error(getCollectionErrorMessage(result.error, translations), {
        id: 'collections-storage-error'
      })
    }
    setIsReady(true)
  }, [translations])

  const savedCount = collections.reduce(
    (count, collection) => count + Number(collection.resourceIds.includes(resourceId)),
    0
  )
  const isSaved = savedCount > 0
  const buttonLabel = isSaved
    ? formatMessage(
        savedCount === 1 ? translations.popover.savedSingular : translations.popover.savedPlural,
        { count: savedCount }
      )
    : translations.popover.unsaved

  function handleToggle(collectionId: string) {
    const result = toggleCollectionResource(collectionId, resourceId)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }
    setCollections(result.collections)
  }

  function handleCreate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateCollection) return

    const result = createCollection(name, resourceId, translations.inbox)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }

    setCollections(result.collections)
    setName('')
    setIsCreating(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) return

    const result = loadCollections(translations.importedFavorites)
    if (!result.success) {
      toast.error(getCollectionErrorMessage(result.error, translations))
      return
    }
    setCollections(result.collections)
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          disabled={!isReady}
          aria-label={buttonLabel}
          title={buttonLabel}
          className='text-light-800 hover:bg-light-600/60 hover:text-light-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-violet-300'
        >
          <Bookmark
            aria-hidden='true'
            className={cn('size-4', isSaved && 'fill-current text-light-950 dark:text-violet-300')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        sideOffset={8}
        className='w-[min(280px,calc(100vw-24px))] rounded-xl border-light-700/70 bg-stone-50 p-2 shadow-xl dark:border-neutral-800 dark:bg-[#151515]'
      >
        <div className='min-w-0 border-b border-light-700/60 px-2 pb-3 pt-1 dark:border-neutral-800'>
          <p className='truncate text-sm font-semibold'>{translations.popover.title}</p>
          <p className='mt-1 truncate text-xs text-muted-foreground'>{title}</p>
        </div>

        <div className='max-h-64 space-y-0.5 overflow-y-auto py-2'>
          {collections.map((collection) => {
            const isSelected = collection.resourceIds.includes(resourceId)
            const isFull =
              !isSelected && collection.resourceIds.length >= MAX_RESOURCES_PER_COLLECTION
            const collectionName =
              collection.kind === 'inbox' ? translations.inbox : collection.name

            return (
              <Button
                type='button'
                variant='ghost'
                role='checkbox'
                aria-checked={isSelected}
                disabled={isFull}
                key={collection.id}
                onClick={() => handleToggle(collection.id)}
                className='h-auto min-h-11 w-full justify-start gap-3 rounded-lg px-2 text-left hover:bg-light-600/50 dark:hover:bg-neutral-800/80'
              >
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded border border-light-800/40 dark:border-neutral-600',
                    isSelected &&
                      'border-light-950 bg-light-950 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-neutral-950'
                  )}
                >
                  {isSelected ? <Check className='size-3.5' /> : null}
                </span>
                <span className='min-w-0 flex-1 truncate'>{collectionName}</span>
                <span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
                  {collection.resourceIds.length}/{MAX_RESOURCES_PER_COLLECTION}
                </span>
              </Button>
            )
          })}
        </div>

        <div className='border-t border-light-700/60 pt-2 dark:border-neutral-800'>
          {isCreating ? (
            <form
              onSubmit={handleCreate}
              className='space-y-2 px-1'
            >
              <label
                htmlFor={`collection-name-${resourceId}`}
                className='sr-only'
              >
                {translations.nameLabel}
              </label>
              <input
                autoFocus
                id={`collection-name-${resourceId}`}
                value={name}
                minLength={MIN_COLLECTION_NAME_LENGTH}
                maxLength={MAX_COLLECTION_NAME_LENGTH}
                onChange={(event) => setName(event.target.value)}
                placeholder={translations.namePlaceholder}
                className='h-9 w-full rounded-md border border-light-700 bg-white px-3 text-sm outline-hidden focus:border-light-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-violet-400'
              />
              <div className='flex justify-end gap-1.5'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => {
                    setIsCreating(false)
                    setName('')
                  }}
                  className='text-muted-foreground hover:bg-light-600/60 dark:hover:bg-neutral-800'
                  aria-label={translations.cancel}
                >
                  <X className='size-4' />
                </Button>
                <Button
                  type='submit'
                  size='xs'
                  disabled={!canCreateCollection}
                  className='max-w-full truncate'
                >
                  {translations.create}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              type='button'
              variant='ghost'
              disabled={collections.length >= MAX_COLLECTIONS}
              onClick={() => setIsCreating(true)}
              className='min-h-10 w-full justify-start gap-2 rounded-lg px-2 text-light-950 hover:bg-light-600/50 dark:text-violet-300 dark:hover:bg-violet-500/10'
            >
              <Plus className='size-4' />
              <span className='min-w-0 flex-1 truncate text-left'>
                {translations.popover.create}
              </span>
              <span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
                {collections.length}/{MAX_COLLECTIONS}
              </span>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
