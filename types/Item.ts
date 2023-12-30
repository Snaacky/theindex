export interface Item {
  _id: string
  name: string
  urls: string[]
  nsfw: boolean
  blacklist: boolean
  sponsor: boolean
  description: string
  data: Record<string, boolean | string | string[]>
  stars: number
  views: number
}

export interface ItemUpdate {
  name?: string
  urls?: string[]
  nsfw?: boolean
  blacklist?: boolean
  sponsor?: boolean
  description?: string
  data?: Record<string, boolean | string | string[]>
}
