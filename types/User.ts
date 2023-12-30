export interface User {
  _id: string
  uid: string
  name: string
  image: string
  accountType: AccountType
  description: string
  favs: string[]
  lists: string[]
  followLists: string[]
  createdAt: string
  views: number
}

export enum AccountType {
  admin = 'admin',
  editor = 'editor',
  user = 'user',
}

export interface UserUpdate {
  name?: string
  image?: string
  accountType?: AccountType
  description?: string
  favs?: string[]
  lists?: string[]
  followLists?: string[]
}
