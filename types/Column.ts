export interface Column {
  _id: string
  urlId: string
  name: string
  nsfw: boolean
  description: string
  type: ColumnType
  values: string[]
}

export enum ColumnType {
  boolean = 'boolean',
  proAndCon = 'proAndCon',
  text = 'text',
  array = 'array',
  language = 'language',
}

export interface ColumnUpdate {
  urlId?: string
  name?: string
  nsfw?: boolean
  description?: string
  type?: ColumnType
  values?: string[]
}
