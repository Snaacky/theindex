import Board from './Board'
import { Types } from '../../types/Components'
import { Library } from '../../types/Library'
import { FC } from 'react'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { Collection } from '../../types/Collection'
import { Column } from '../../types/Column'
import { List } from '../../types/List'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  libraries: Library[]
  allLibraries: Library[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
  canEdit?: boolean
}

const LibraryBoard: FC<Props> = ({
  contentOf,
  libraries,
  allLibraries,
  updateURL = '/api/edit/library/order',
  updateKey = 'libraries',
  deleteURL = '/api/delete/library',
  forceEditMode = false,
  canMove = true,
  canEdit = false,
}) => {
  return (
    <Board
      contentOf={contentOf}
      type={Types.library}
      content={libraries}
      allContent={allLibraries}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
      canEdit={canEdit}
    />
  )
}

export default LibraryBoard
