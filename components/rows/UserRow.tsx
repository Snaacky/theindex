import Row from './Row'
import { User } from '../../types/User'
import { FC } from 'react'
import { Types } from '../../types/Components'

type Props = {
  user: User
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const UserRow: FC<Props> = ({
  user,
  add = null,
  remove = null,
  move = null,
}) => {
  const joined = new Date(user.createdAt).toISOString().slice(0, 10)
  return (
    <Row
      type={Types.user}
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

export default UserRow
