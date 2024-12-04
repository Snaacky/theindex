import Card from './Card'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { Collection } from '../../types/Collection'

type Props = {
  collection: Collection
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const CollectionCard: FC<Props> = ({
  collection,
  add,
  remove,
  move,
}) => {
  return (
    <Card
      type={Types.collection}
      content={collection}
      add={add}
      remove={remove}
      move={move}
      imageUrl={collection.img ? '/img/' + collection.img : '/img/puzzled.png'}
    />
  )
}

export default CollectionCard
