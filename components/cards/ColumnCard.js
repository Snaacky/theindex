import Card from './Card'

export default function ColumnCard({
  column,
  add = null,
  remove = null,
  move = null,
}) {
  return (
    <Card
      type={'column'}
      content={column}
      add={add}
      remove={remove}
      move={move}
    />
  )
}
