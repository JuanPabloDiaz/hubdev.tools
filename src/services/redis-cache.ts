import { redis } from '@/ratelimit/redis'

import { Resource } from '@/types/resource'

type CacheQuery = {
  input: string
  data: {
    resources: Resource[]
  }
}

export async function getCache({ input }: { input: string }) {
  const queryCached = (await redis.get(`q:${input}`)) as CacheQuery | null
  if (queryCached != null) {
    return queryCached
  }
}

export async function saveCache({ cache }: { cache: CacheQuery }) {
  const { input, data } = cache
  await redis.set(
    `q:${input}`,
    JSON.stringify({
      data
    }),
    {
      ex: 60 * 60 * 24 // 24 hours
    }
  )
}
