import Board from './Board'
import { Types } from '../../types/Components'
import { FC } from 'react'
import { Column } from '../../types/Column'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { Collection } from '../../types/Collection'
import { Library } from '../../types/Library'
import { List } from '../../types/List'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  columns: Column[]
  allColumns: Column[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
  canEdit?: boolean
}

const ColumnBoard: FC<Props> = ({
  contentOf,
  columns,
  allColumns,
  updateURL = '/api/edit/collection',
  updateKey = 'columns',
  deleteURL = '',
  forceEditMode = false,
  canMove = true,
  canEdit = false,
}) => {
  return (
    <Board
      contentOf={contentOf}
      type={Types.column}
      content={columns}
      allContent={allColumns}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
      canEdit={canEdit}
    />
  )
}

export default ColumnBoard
