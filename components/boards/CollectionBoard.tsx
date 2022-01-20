import Board from './Board'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { Collection } from '../../types/Collection'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { Column } from '../../types/Column'
import { Library } from '../../types/Library'
import { List } from '../../types/List'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  collections: Collection[]
  allCollections: Collection[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
  canEdit?: boolean
}

const CollectionBoard: FC<Props> = ({
  contentOf,
  collections,
  allCollections,
  updateURL = '/api/edit/library',
  updateKey = 'collections',
  deleteURL = '',
  forceEditMode = false,
  canMove = true,
  canEdit = false,
}) => {
  return (
    <Board
      contentOf={contentOf}
      type={Types.collection}
      content={collections}
      allContent={allCollections}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
      canEdit={canEdit}
    />
  )
}

export default CollectionBoard
