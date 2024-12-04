import React from 'react'
import ItemCard from './cards/ItemCard'
import ItemRow from './rows/ItemRow'
import ColumnRow from './rows/ColumnRow'
import CollectionCard from './cards/CollectionCard'
import CollectionRow from './rows/CollectionRow'
import LibraryRow from './rows/LibraryRow'
import ColumnCard from './cards/ColumnCard'
import LibraryCard from './cards/LibraryCard'
import UserCard from './cards/UserCard'
import UserRow from './rows/UserRow'
import ListCard from './cards/ListCard'
import ListRow from './rows/ListRow'
import { Column } from '../types/Column'
import { User } from '../types/User'
import { Item } from '../types/Item'
import { Collection } from '../types/Collection'
import { Library } from '../types/Library'
import { List } from '../types/List'
import { Types } from '../types/Components'

type Props = {
  cardView: boolean,
  type: Types,
  content: User | Item | List | Collection | Column | Library
  columns: Column[]
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const CardRowView = ({
  cardView = true,
  type,
  content,
  add,
  move,
  remove,
  columns = [],
}: Props) => {
  if (type === Types.item) {
    if (cardView) {
      return (
        <ItemCard
          item={content as Item}
          columns={columns}
          add={add}
          move={move}
          remove={remove}
        />
      )
    }
    return (
      <ItemRow
        item={content as Item}
        columns={columns}
        add={add}
        move={move}
        remove={remove}
      />
    )
  } else if (type === Types.column) {
    if (cardView) {
      return (
        <ColumnCard column={content as Column} add={add} move={move} remove={remove} />
      )
    }
    return <ColumnRow column={content as Column} add={add} move={move} remove={remove} />
  } else if (type === Types.collection) {
    if (cardView) {
      return (
        <CollectionCard
          collection={content as Collection}
          add={add}
          move={move}
          remove={remove}
        />
      )
    }
    return (
      <CollectionRow
        collection={content as Collection}
        add={add}
        move={move}
        remove={remove}
      />
    )
  } else if (type === Types.library) {
    if (cardView) {
      return (
        <LibraryCard library={content as Library} add={add} move={move} remove={remove} />
      )
    }
    return (
      <LibraryRow library={content as Library} add={add} move={move} remove={remove} />
    )
  } else if (type === Types.user) {
    if (cardView) {
      return <UserCard user={content as User} add={add} move={move} remove={remove} />
    }
    return <UserRow user={content as User} add={add} move={move} remove={remove} />
  } else if (type === Types.list) {
    if (cardView) {
      return <ListCard list={content as List} add={add} move={move} remove={remove} />
    }
    return <ListRow list={content as List} add={add} move={move} remove={remove} />
  } else {
    console.error('Unknown type of content:', type)
  }
}

export default CardRowView
