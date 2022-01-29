import Card from './Card'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { List } from '../../types/List'

type Props = {
  list: List
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const ListCard: FC<Props> = ({
  list,
  add = null,
  remove = null,
  move = null,
}) => {
  return (
    <Card
      type={Types.list}
      content={list}
      add={add}
      remove={remove}
      move={move}
    />
  )
}

export default ListCard
