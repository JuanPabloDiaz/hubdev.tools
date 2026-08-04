import { ImageResponse } from 'next/og'

import { APP_URL } from '@/constants'
import { getCategoryDetails } from '@/services/list'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getLocalizedDescription, getLocalizedName } from '@/i18n/taxonomy'

export default async function Image({
  params
}: {
  params: Promise<{
    category: string
    locale: string
  }>
}) {
  const size = {
    width: 1200,
    height: 630
  }

  const { category, locale } = await params
  if (!isLocale(locale)) return new Response('Not found', { status: 404 })
  const dictionary = await getDictionary(locale)

  const details = await getCategoryDetails({
    slug: category
  })

  if (!details) {
    return new ImageResponse(
      <div
        style={{
          background: '#171717',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          color: '#B9B9B9',
          fontSize: '5rem'
        }}
      >
        {dictionary.metadata.categoryNotFound}
      </div>
    )
  }

  const description = getLocalizedDescription(details, locale)

  return new ImageResponse(
    <div
      style={{
        background: '#171717',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundSize: '70px 70px',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      ></div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '0'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            margin: '35px'
          }}
        >
          <img
            src={`${APP_URL}/assets/icon.png`}
            style={{
              width: '40px',
              height: '40px'
            }}
            alt='Icon'
          />
          <p
            style={{
              color: '#B9B9B9',
              fontSize: '2rem'
            }}
          >
            hubdev
          </p>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          margin: '35px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fde047',
            fontSize: '6rem'
          }}
        >
          <span>{getLocalizedName(details, locale)}</span>
        </div>
        <p
          style={{
            color: '#B9B9B9',
            fontSize: '3rem'
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '0'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            margin: '35px'
          }}
        >
          <p
            style={{
              color: '#c5c5c5',
              fontSize: '1.2rem'
            }}
          >
            {dictionary.metadata.learnMore} 👉 {APP_URL}
          </p>
        </div>
      </div>
    </div>,
    {
      ...size
    }
  )
}
