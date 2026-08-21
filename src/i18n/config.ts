export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const preferredLocale = acceptLanguage
    .split(',')
    .flatMap((entry) => {
      const [languageTag, ...parameters] = entry.trim().toLowerCase().split(';')
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='))
      const quality = qualityParameter ? Number.parseFloat(qualityParameter.trim().slice(2)) : 1
      const language = languageTag.split('-')[0]

      if (!isLocale(language) || !Number.isFinite(quality) || quality <= 0) return []

      return [{ locale: language, quality: Math.min(quality, 1) }]
    })
    .sort((a, b) => b.quality - a.quality)[0]?.locale

  return preferredLocale ?? defaultLocale
}
