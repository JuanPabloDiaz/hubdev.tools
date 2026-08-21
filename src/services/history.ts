import { cookies } from 'next/headers'

export async function getHistory(): Promise<string[]> {
  const cookieStore = await cookies()
  const value = cookieStore.get('history')?.value
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
