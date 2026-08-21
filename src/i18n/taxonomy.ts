import type { Locale } from './config'

type LocalizedTaxonomyValue = {
  name: string
  name_es?: string | null
  description?: string | null
  description_es?: string | null
}

export function getLocalizedName(value: LocalizedTaxonomyValue, locale: Locale) {
  return locale === 'es' ? value.name_es || value.name : value.name
}

export function getLocalizedDescription(value: LocalizedTaxonomyValue, locale: Locale) {
  const description =
    locale === 'es' ? value.description_es || value.description : value.description
  return description ?? ''
}
