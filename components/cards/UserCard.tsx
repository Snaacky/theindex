import Card from './Card'
import { FC } from 'react'
import { User } from '../../types/User'
import { Types } from '../../types/Components'

type Props = {
  user: User
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const UserCard: FC<Props> = ({ user, add, remove, move }) => {
  const joined = new Date(user.createdAt).toISOString().slice(0, 10)
  return (
    <Card
      type={Types.user}
      content={user}
      imageUrl={user.image}
      add={add}
      remove={remove}
      move={move}
      bodyContent={
        <div className={'text-muted mt-auto align-self-end'}>
          Joined <code>{joined}</code>
        </div>
      }
    />
  )
}

export default UserCard
