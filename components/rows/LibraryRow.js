import Row from './Row'

export default function LibraryRow({
  library,
  move = null,
  add = null,
  remove = null,
}) {
  return (
    <Row
      type={'library'}
      content={library}
      add={add}
      move={move}
      remove={remove}
      imageUrl={library.img ? '/img/' + library.img : '/img/puzzled.png'}
    />
  )
}
