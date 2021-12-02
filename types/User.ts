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
}

export enum AccountType {
  admin = 'admin',
  editor = 'editor',
  user = 'user',
}

export interface UserUpdate {
  accountType?: AccountType
  description?: string
  favs?: string[]
  lists?: string[]
  followLists?: string[]
}
