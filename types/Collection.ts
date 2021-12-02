export interface Collection {
  _id: string
  urlId: string
  img: string
  name: string
  nsfw: boolean
  description: string
  columns: string[]
  items: string[]
}

export interface CollectionUpdate {
  urlId?: string
  img?: string
  name?: string
  nsfw?: boolean
  description?: string
  columns?: string[]
  items?: string[]
}
