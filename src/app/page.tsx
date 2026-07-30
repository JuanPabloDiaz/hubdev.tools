import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { Container } from '@/components/container'
import { Dashboard } from '@/components/dashboard'
import { getSearchHref } from '@/utils/search'

export const maxDuration = 60

export default async function MainPage({
  searchParams
}: {
  searchParams: Promise<{
    query?: string
  }>
}) {
  const { query } = await searchParams

  if (query) {
    redirect(getSearchHref(query))
  }

  return (
    <Container>
      <Suspense>
        <Dashboard />
      </Suspense>
    </Container>
  )
}
