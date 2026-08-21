export function LoadingCards() {
  return (
    <>
      <div className='flex flex-col gap-3 mt-8'>
        <div className='h-8 w-56 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-8 max-w-full w-[600px] animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-[200px] w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
      </div>
    </>
  )
}

export function LoadingResources() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 py-6'>
      {Array.from({ length: 20 }, (_, index) => (
        <ResourceSkeleton key={index} />
      ))}
    </div>
  )
}

export function SubmitFormSkeleton() {
  return (
    <div
      className='space-y-4'
      aria-hidden='true'
    >
      <div className='grid gap-2'>
        <div className='h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-9 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
      </div>
      <div className='h-10 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900' />
    </div>
  )
}

function ResourceSkeleton() {
  return (
    <div
      className='flex w-full animate-pulse flex-col gap-3 rounded-lg border p-2.5'
      aria-hidden='true'
    >
      <div className='aspect-video w-full rounded-md bg-neutral-200 dark:bg-neutral-900' />
      <div className='flex flex-col gap-2'>
        <div className='h-5 w-2/5 rounded bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-4 w-full rounded bg-neutral-200 dark:bg-neutral-900' />
        <div className='h-4 w-4/5 rounded bg-neutral-200 dark:bg-neutral-900' />
      </div>
      <div className='mt-auto h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-900' />
    </div>
  )
}
