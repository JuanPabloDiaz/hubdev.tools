import { createHash } from 'node:crypto'

import { createGroq } from '@ai-sdk/groq'
import { generateObject } from 'ai'
import * as z from 'zod'

import { SearchInsight, SearchQuickAction, SearchResource } from '@/types/search'

import { redis } from '@/ratelimit/redis'
import { isValidSearchQuery, MAX_SEARCH_QUERY_LENGTH, normalizeSearchQuery } from '@/utils/search'

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

const insightSchema = z.object({
  headline: z.string().min(1),
  statements: z
    .array(
      z.object({
        text: z.string().min(1),
        citedResourceIds: z.array(z.string()).min(1)
      })
    )
    .min(1),
  quickActions: z.array(
    z.object({
      label: z.string(),
      query: z.string()
    })
  )
})

const MAX_HEADLINE_LENGTH = 80
const MAX_STATEMENT_LENGTH = 220
const MAX_ACTION_LABEL_LENGTH = 28

function truncateText(value: string, maxLength: number) {
  const normalized = normalizeSearchQuery(value)
  if (normalized.length <= maxLength) return normalized

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

function canUseRedis() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

function createInsightCacheKey(query: string, resources: SearchResource[]) {
  const fingerprint = createHash('sha256')
    .update(
      JSON.stringify({
        query,
        resources: resources.map(({ id, title, summary }) => ({
          id,
          title,
          summary
        }))
      })
    )
    .digest('hex')

  return `search:insight:v1:${fingerprint}`
}

function getFallbackActions(query: string): SearchQuickAction[] {
  const candidates = [
    {
      label: 'Only open source',
      suffix: 'open source'
    },
    {
      label: 'Compare alternatives',
      suffix: 'alternatives'
    },
    {
      label: 'Beginner friendly',
      suffix: 'for beginners'
    }
  ]

  return candidates.map(({ label, suffix }) => {
    const maxQueryLength = MAX_SEARCH_QUERY_LENGTH - suffix.length - 1

    return {
      label,
      query: normalizeSearchQuery(`${query.slice(0, maxQueryLength)} ${suffix}`)
    }
  })
}

function sanitizeInsight({
  insight,
  query,
  resources
}: {
  insight: z.infer<typeof insightSchema>
  query: string
  resources: SearchResource[]
}): SearchInsight | undefined {
  const allowedResourceIds = new Set(resources.map(({ id }) => id))
  const statements = insight.statements
    .map((statement) => ({
      text: truncateText(statement.text, MAX_STATEMENT_LENGTH),
      citedResourceIds: [...new Set(statement.citedResourceIds)].filter((id) =>
        allowedResourceIds.has(id)
      )
    }))
    .filter((statement) => statement.text && statement.citedResourceIds.length > 0)
    .slice(0, 3)

  if (statements.length === 0) {
    return
  }

  const seenQueries = new Set([query.toLowerCase()])
  const quickActions = insight.quickActions
    .map((action) => ({
      label: truncateText(action.label, MAX_ACTION_LABEL_LENGTH),
      query: normalizeSearchQuery(action.query).slice(0, MAX_SEARCH_QUERY_LENGTH)
    }))
    .filter((action) => {
      const normalized = action.query.toLowerCase()
      if (!action.label || !isValidSearchQuery(action.query) || seenQueries.has(normalized)) {
        return false
      }
      seenQueries.add(normalized)
      return true
    })

  for (const fallback of getFallbackActions(query)) {
    if (quickActions.length === 3) break
    const normalized = fallback.query.toLowerCase()
    if (!seenQueries.has(normalized)) {
      seenQueries.add(normalized)
      quickActions.push(fallback)
    }
  }

  return {
    headline: truncateText(insight.headline, MAX_HEADLINE_LENGTH),
    statements,
    quickActions: quickActions.slice(0, 3)
  }
}

export async function generateSearchInsight({
  query: input,
  resources
}: {
  query: string
  resources: SearchResource[]
}): Promise<SearchInsight | undefined> {
  const query = normalizeSearchQuery(input)

  if (!process.env.GROQ_API_KEY || resources.length === 0) {
    return
  }

  const cacheKey = createInsightCacheKey(query, resources)

  if (canUseRedis()) {
    try {
      const cached = await redis.get<SearchInsight>(cacheKey)
      if (cached) return cached
    } catch (error) {
      console.error('Unable to read the search insight cache.', error)
    }
  }

  try {
    const result = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      schema: insightSchema,
      system: `You write concise search-result summaries for a developer resource directory.
Use only the supplied resource titles, summaries, categories, IDs, and ranking positions.
Never add product claims that are not supported by those fields.
Write every resource name exactly as supplied so it can be highlighted in the interface.
Use plain text only. Never use Markdown markers such as **, __, #, or backticks.
Recommend the strongest match, explain the most useful tradeoff, and cite every statement with one or more supplied resource IDs.
Return no more than three statements.
Generate exactly three actions that refine the original search into a complete new global search query.
Keep every action label at 28 characters or fewer and every action query at 120 characters or fewer.`,
      prompt: JSON.stringify({
        query,
        resources: resources.map(({ id, title, summary, category, rankPosition }) => ({
          id,
          title,
          summary,
          category,
          rankPosition
        }))
      })
    })

    const insight = sanitizeInsight({
      insight: result.object,
      query,
      resources
    })

    if (!insight) return

    if (canUseRedis()) {
      try {
        await redis.set(cacheKey, JSON.stringify(insight), {
          ex: 60 * 60 * 24
        })
      } catch (error) {
        console.error('Unable to save the search insight cache.', error)
      }
    }

    return insight
  } catch (error) {
    console.error('Unable to generate a search insight.', error)
  }
}
