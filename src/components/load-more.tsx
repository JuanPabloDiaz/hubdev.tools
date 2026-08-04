'use client'

import { ArrowDownToLineIcon, LoaderCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LoadMore({
  loadMoreResources,
  isLoading,
  label
}: {
  loadMoreResources: () => void
  isLoading: boolean
  label: string
}) {
  return (
    <Button
      className='mt-2 rounded-full mx-auto flex justify-center'
      onClick={loadMoreResources}
    >
      {isLoading ? (
        <LoaderCircleIcon className='animate-spin size-4 mr-2' />
      ) : (
        <ArrowDownToLineIcon className='size-4 mr-2' />
      )}
      <span className='text-sm'>{label}</span>
    </Button>
  )
}
