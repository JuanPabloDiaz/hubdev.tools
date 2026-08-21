export type CatalogResource = {
  id: string
  title: string
  url: string
  image: string
  placeholder: string | null
  brief: string
}

export type LocalizedCategory = {
  id: number
  slug: string
  title: string
  description: string
}

export type LocalizedSubcategory = {
  id: number
  slug: string
  title: string
}
