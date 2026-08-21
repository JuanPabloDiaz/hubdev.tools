export const MIN_SEARCH_QUERY_LENGTH = 2
export const MAX_SEARCH_QUERY_LENGTH = 120

export function normalizeSearchQuery(query: string) {
  return query.trim().replace(/\s+/g, ' ')
}

export function isValidSearchQuery(query: string) {
  const length = normalizeSearchQuery(query).length
  return length >= MIN_SEARCH_QUERY_LENGTH && length <= MAX_SEARCH_QUERY_LENGTH
}

export function getSearchHref(query: string) {
  const params = new URLSearchParams({
    q: normalizeSearchQuery(query)
  })

  return `/search?${params.toString()}`
}
