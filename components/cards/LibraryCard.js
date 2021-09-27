import Card from './Card'

export default function LibraryCard({
  library,
  add = null,
  remove = null,
  move = null,
}) {
  return (
    <Card
      type={'library'}
      content={library}
      add={add}
      remove={remove}
      move={move}
      imageUrl={library.img ? '/img/' + library.img : '/img/puzzled.png'}
    />
  )
}
