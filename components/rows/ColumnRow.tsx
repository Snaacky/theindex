import Row from './Row'
import { Column } from '../../types/Column'
import { FC } from 'react'
import { Types } from '../../types/Components'

type Props = {
  column: Column
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const ColumnRow: FC<Props> = ({ column, add, remove, move }) => {
  return (
    <Row
      type={Types.column}
      content={column}
      add={add}
      remove={remove}
      move={move}
    />
  )
}

export default ColumnRow
