import {Collection} from "./Collection";

export interface Library {
  _id: string
  urlId: string
  img: string
  name: string
  nsfw: boolean
  description: string
  collections: string[]
  order: number
}

export interface LibraryWithCollection {
  _id: string
  urlId: string
  img: string
  name: string
  nsfw: boolean
  description: string
  collections: Collection[]
  order: number
}

export interface LibraryUpdate {
  urlId?: string
  img?: string
  name?: string
  nsfw?: boolean
  description?: string
  collections?: string[]
  order?: number
}
