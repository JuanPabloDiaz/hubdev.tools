import type { Locale } from './config'

export function stripLocale(pathname: string) {
  for (const locale of ['en', 'es'] as const) {
    const prefix = `/${locale}`
    if (pathname === prefix) return '/'
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || '/'
    }
  }
  return pathname || '/'
}

export function localizePathname(pathname: string, locale: Locale) {
  const basePathname = stripLocale(pathname)
  return basePathname === '/' ? `/${locale}` : `/${locale}${basePathname}`
}

export function getLocalizedHref(href: string, locale: Locale) {
  const url = new URL(href, 'https://hubdev.tools')
  url.pathname = localizePathname(url.pathname, locale)
  return `${url.pathname}${url.search}${url.hash}`
}

export function getAlternateUrls(pathname: string, locale: Locale) {
  const basePathname = stripLocale(pathname)
  return {
    canonical: localizePathname(basePathname, locale),
    languages: {
      en: localizePathname(basePathname, 'en'),
      es: localizePathname(basePathname, 'es'),
      'x-default': basePathname
    }
  }
}
