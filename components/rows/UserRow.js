import Row from './Row'

export default function UserRow({
  user,
  add = null,
  remove = null,
  move = null,
}) {
  const joined = new Date(user.createdAt).toISOString().slice(0, 10)
  return (
    <Row
      type={'user'}
      content={user}
      add={add}
      remove={remove}
      move={move}
      bodyContent={
        <div className={'text-muted'}>
          Joined <code>{joined}</code>
        </div>
      }
      imageUrl={user.image ? user.image : '/img/puzzled.png'}
    />
  )
}
