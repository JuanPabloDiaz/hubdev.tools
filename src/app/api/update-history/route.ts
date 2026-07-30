import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { isValidSearchQuery, normalizeSearchQuery } from '@/utils/search'

function parseHistory(value?: string) {
  if (!value) return []

  try {
    const history: unknown = JSON.parse(value)
    return Array.isArray(history)
      ? history.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const input =
      typeof body === 'object' && body !== null && 'input' in body && typeof body.input === 'string'
        ? normalizeSearchQuery(body.input)
        : ''

    if (!isValidSearchQuery(input)) {
      return NextResponse.json({ error: 'Invalid search query.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const history = parseHistory(cookieStore.get('history')?.value)
    const nextHistory = [input, ...history.filter((item) => item !== input)].slice(0, 5)

    cookieStore.set('history', JSON.stringify(nextHistory), {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      { error: 'An error occurred while updating the history.' },
      { status: 500 }
    )
  }
}
