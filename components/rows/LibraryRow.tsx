import Row from './Row'
import { Types } from '../../types/Components'
import { Library } from '../../types/Library'
import { FC } from 'react'

type Props = {
  library: Library
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const LibraryRow: FC<Props> = ({ library, move, add, remove }) => {
  return (
    <Row
      type={Types.library}
      content={library}
      add={add}
      move={move}
      remove={remove}
      imageUrl={library.img ? '/img/' + library.img : '/img/puzzled.png'}
    />
  )
}

export default LibraryRow
