import { NextResponse, type NextRequest } from 'next/server'

import { getPreferredLocale, locales } from '@/i18n/config'
import { updateClicks } from '@/services/updateClicks'

export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const resourceLink = searchParams.get('ref')

  if (resourceLink) {
    if (process.env.NODE_ENV === 'production') {
      const { message, success, code } = await updateClicks({
        url: resourceLink
      })
      if (!success) {
        return NextResponse.json(
          {
            error: message
          },
          {
            status: code
          }
        )
      }
    }

    return NextResponse.redirect(new URL(resourceLink, request.url))
  }

  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Accept-Language')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)']
}
