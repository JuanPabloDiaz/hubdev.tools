import { Resource } from '@/types/resource'

export type SearchResource = Resource & {
  rankPosition: number
}

export type SearchInsightStatement = {
  text: string
  citedResourceIds: string[]
}

export type SearchQuickAction = {
  label: string
  query: string
}

export type SearchInsight = {
  headline: string
  statements: SearchInsightStatement[]
  quickActions: SearchQuickAction[]
}
