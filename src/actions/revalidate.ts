'use server'

import { revalidatePath, updateTag } from 'next/cache'

type RevalidationType = 'tag' | 'path'

export async function revalidate({ key, type }: { key: string; type: RevalidationType }) {
  if (type === 'tag') {
    updateTag(key)
    return
  }

  revalidatePath(key)
}
