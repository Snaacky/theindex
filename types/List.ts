export interface List {
  _id: string
  owner: string
  name: string
  nsfw: boolean
  description: string
  items: string[]
  columns: string[]
}

export interface ListUpdate {
  name?: string
  nsfw?: boolean
  description?: string
  items?: string[]
  columns?: string[]
}
