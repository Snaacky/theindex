import Board from './Board'
import { Types } from '../../types/Components'
import { FC } from 'react'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { List } from '../../types/List'
import { Collection } from '../../types/Collection'
import { Column } from '../../types/Column'
import { Library } from '../../types/Library'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  users: User[]
  allUsers: User[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
}

const UserBoard: FC<Props> = ({
  contentOf,
  users,
  allUsers,
  updateURL = '',
  updateKey = '',
  deleteURL = '/api/delete/user',
  forceEditMode = false,
  canMove = true,
}) => {
  return (
    <Board
      contentOf={contentOf}
      type={Types.user}
      content={users}
      allContent={allUsers}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
    />
  )
}

export default UserBoard
