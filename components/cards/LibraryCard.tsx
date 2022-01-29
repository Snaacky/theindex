import Card from './Card'
import { Library } from '../../types/Library'
import { FC } from 'react'
import { Types } from '../../types/Components'

type Props = {
  library: Library
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const LibraryCard: FC<Props> = ({
  library,
  add = null,
  remove = null,
  move = null,
}) => {
  return (
    <Card
      type={Types.library}
      content={library}
      add={add}
      remove={remove}
      move={move}
      imageUrl={library.img ? '/img/' + library.img : '/img/puzzled.png'}
    />
  )
}

export default LibraryCard
