import Card from './Card'

export default function CollectionCard({
  collection,
  add = null,
  remove = null,
  move = null,
}) {
  return (
    <Card
      type={'collection'}
      content={collection}
      add={add}
      remove={remove}
      move={move}
      imageUrl={collection.img ? '/img/' + collection.img : '/img/puzzled.png'}
    />
  )
}
