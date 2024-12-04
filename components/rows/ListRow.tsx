import Row from './Row'
import { List } from '../../types/List'
import { FC } from 'react'
import { Types } from '../../types/Components'

type Props = {
  list: List
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const ListRow: FC<Props> = ({ list, add, remove, move }) => {
  return (
    <Row
      type={Types.list}
      content={list}
      add={add}
      remove={remove}
      move={move}
    />
  )
}

export default ListRow
