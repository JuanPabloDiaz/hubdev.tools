import { ViewTransitions } from 'next-view-transitions'

import '../globals.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import { APP_URL } from '@/constants'
import { AISearch } from '@/components/ai-search'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAlternateUrls } from '@/i18n/routing'

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}>

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)
  const alternates = getAlternateUrls(`/${locale}`, locale)

  return {
    metadataBase: new URL(APP_URL),
    title: {
      template: `%s | ${dictionary.metadata.title}`,
      default: dictionary.metadata.title
    },
    alternates,
    description: dictionary.metadata.description,
    keywords: [
      'dev resources',
      'developers tools',
      'developer resources',
      'tools',
      'libraries',
      'courses',
      'programming',
      'database',
      'open source',
      'icons',
      'ui',
      'design',
      'ai',
      'hosting',
      'docs',
      'animation'
    ],
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      url: `/${locale}`,
      siteName: 'hubdev',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: locale === 'es' ? ['en_US'] : ['es_ES'],
      type: 'website',
      images: [
        {
          url: '/assets/banner.jpg',
          width: 1835,
          height: 1000,
          type: 'image/jpeg'
        }
      ]
    }
  }
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()

  const locale: Locale = localeParam
  const dictionary = await getDictionary(locale)

  return (
    <ViewTransitions>
      <html
        lang={locale}
        suppressHydrationWarning
      >
        <body className={`flex flex-col min-h-screen px-1 !sm:px-2`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header
              locale={locale}
              homeLabel={dictionary.header.home}
              repositoryLabel={dictionary.header.repository}
              languageTranslations={dictionary.header}
              themeTranslations={dictionary.theme}
              submitTranslations={dictionary.submit}
              genericError={dictionary.errors.generic}
            />
            <div className='px-4 py-6 md:px-6 md:py-8 max-w-full md:max-w-8xl'>
              <Sidebar locale={locale} />
              {children}
              <AISearch
                locale={locale}
                translations={dictionary.search.toolbar}
              />
            </div>
          </ThemeProvider>
          <Toaster
            theme='system'
            toastOptions={{
              classNames: {
                toast: 'bg-background dark:border-input border-light-700/60',
                title: 'dark:text-white text-light-900',
                icon: 'dark:text-white text-light-900'
              }
            }}
          />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  )
}
