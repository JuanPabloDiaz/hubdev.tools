import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { plusJakartaSans } from '@/fonts'
import { ResourceItem } from '@/components/list-resource'
import type { CatalogResource } from '@/types/catalog'
import type { CollectionsTranslations, ResourceTranslations } from '@/i18n/messages'
import { cn } from '@/utils/styles'

type ResourceRowProps = {
  title: string
  description: string
  resources: CatalogResource[]
  resourceTranslations: ResourceTranslations
  collectionTranslations: CollectionsTranslations
  viewAllHref?: string
  viewAllLabel?: string
}

export function ResourceRow({
  title,
  description,
  resources,
  resourceTranslations,
  collectionTranslations,
  viewAllHref,
  viewAllLabel
}: ResourceRowProps) {
  if (resources.length === 0) return null

  return (
    <section>
      <div className='mb-4 flex items-baseline justify-between gap-3'>
        <div className='flex flex-col gap-0.5'>
          <h2 className={cn(plusJakartaSans.className, 'text-lg font-bold text-foreground')}>
            {title}
          </h2>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        {viewAllHref && viewAllLabel ? (
          <Link
            href={viewAllHref}
            className='flex items-center gap-0.5 text-sm font-semibold text-blue-700 hover:underline underline-offset-2 dark:text-anchor'
          >
            {viewAllLabel}
            <ChevronRight className='size-3.5' />
          </Link>
        ) : null}
      </div>

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {resources.map((resource, index) => (
          <ResourceItem
            key={resource.id}
            order={index}
            id={resource.id}
            title={resource.title}
            url={resource.url}
            brief={resource.brief}
            image={resource.image}
            placeholder={resource.placeholder}
            resourceTranslations={resourceTranslations}
            collectionTranslations={collectionTranslations}
          />
        ))}
      </div>
    </section>
  )
}
