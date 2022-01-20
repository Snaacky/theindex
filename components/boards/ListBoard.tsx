import Board from './Board'
import { List } from '../../types/List'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { Collection } from '../../types/Collection'
import { Column } from '../../types/Column'
import { Library } from '../../types/Library'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  lists: List[]
  allLists: List[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
  canEdit?: boolean
}

const ListBoard: FC<Props> = ({
  contentOf,
  lists,
  allLists,
  updateURL = '',
  updateKey = 'lists',
  deleteURL = '/api/delete/list',
  forceEditMode = false,
  canMove = false,
  canEdit = false,
}) => {
  return (
    <Board
      contentOf={contentOf}
      type={Types.list}
      content={lists}
      allContent={allLists}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
      canEdit={canEdit}
    />
  )
}

export default ListBoard
