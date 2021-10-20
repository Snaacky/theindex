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

const CardRowView = ({
  cardView = true,
  type,
  content,
  add = null,
  move = null,
  remove = null,
  columns = [],
}) => {
  if (type === 'item') {
    if (cardView) {
      return (
        <ItemCard
          item={content}
          columns={columns}
          add={add}
          move={move}
          remove={remove}
        />
      )
    }
    return (
      <ItemRow
        item={content}
        columns={columns}
        add={add}
        move={move}
        remove={remove}
      />
    )
  } else if (type === 'column') {
    if (cardView) {
      return (
        <ColumnCard column={content} add={add} move={move} remove={remove} />
      )
    }
    return <ColumnRow column={content} add={add} move={move} remove={remove} />
  } else if (type === 'collection') {
    if (cardView) {
      return (
        <CollectionCard
          collection={content}
          add={add}
          move={move}
          remove={remove}
        />
      )
    }
    return (
      <CollectionRow
        collection={content}
        add={add}
        move={move}
        remove={remove}
      />
    )
  } else if (type === 'library') {
    if (cardView) {
      return (
        <LibraryCard library={content} add={add} move={move} remove={remove} />
      )
    }
    return (
      <LibraryRow library={content} add={add} move={move} remove={remove} />
    )
  } else if (type === 'user') {
    if (cardView) {
      return <UserCard user={content} add={add} move={move} remove={remove} />
    }
    return <UserRow user={content} add={add} move={move} remove={remove} />
  } else if (type === 'list') {
    if (cardView) {
      return <ListCard list={content} add={add} move={move} remove={remove} />
    }
    return <ListRow list={content} add={add} move={move} remove={remove} />
  } else {
    console.error('Unknown type of content:', type)
  }
}

export default CardRowView
