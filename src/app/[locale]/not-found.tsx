import { Container } from '@/components/container'
import { getDictionary } from '@/i18n/dictionaries'
import { NotFoundContent } from './not-found-content'

export default async function NotFound() {
  const [englishDictionary, spanishDictionary] = await Promise.all([
    getDictionary('en'),
    getDictionary('es')
  ])

  return (
    <Container>
      <NotFoundContent
        translations={{
          en: englishDictionary.notFound,
          es: spanishDictionary.notFound
        }}
      />
    </Container>
  )
}
