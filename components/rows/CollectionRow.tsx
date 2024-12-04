import Row from './Row'
import { Types } from '../../types/Components'
import { Collection } from '../../types/Collection'
import { FC } from 'react'

type Props = {
  collection: Collection
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const CollectionRow: FC<Props> = ({ collection, add, remove, move }) => {
  return (
    <Row
      type={Types.collection}
      content={collection}
      add={add}
      remove={remove}
      move={move}
      imageUrl={collection.img ? '/img/' + collection.img : '/img/puzzled.png'}
    />
  )
}

export default CollectionRow
