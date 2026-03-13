import Board from './Board'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { Item } from '../../types/Item'
import { Column } from '../../types/Column'
import { User } from '../../types/User'
import { Collection } from '../../types/Collection'
import { Library } from '../../types/Library'
import { List } from '../../types/List'

type Props = {
  contentOf: User | Item | List | Collection | Column | Library | null
  items: Item[]
  allItems: Item[]
  columns: Column[]
  updateURL?: string
  updateKey?: string
  deleteURL?: string
  forceEditMode?: boolean
  canMove?: boolean
  canEdit?: boolean
  showSponsors?: boolean
  loadAllContentUrl?: string
  deferAllContentLoad?: boolean
}

const ItemBoard: FC<Props> = ({
  contentOf,
  items,
  allItems,
  columns,
  updateURL = '/api/edit/collection',
  updateKey = 'items',
  deleteURL = '',
  forceEditMode = false,
  canMove = false,
  canEdit = false,
  showSponsors = false,
  loadAllContentUrl = '',
  deferAllContentLoad = false,
}) => {
  items = items.filter((i) => typeof i !== 'undefined' && i !== null)
  const sponsoredItems = showSponsors ? items.filter((i) => i.sponsor) : []

  return (
    <Board
      contentOf={contentOf}
      type={Types.item}
      content={items}
      allContent={allItems}
      sponsorContent={sponsoredItems}
      columns={columns}
      updateContentURL={updateURL}
      updateContentKey={updateKey}
      deleteContentURL={deleteURL}
      forceEditMode={forceEditMode}
      canMove={canMove}
      canEdit={canEdit}
      loadAllContentUrl={loadAllContentUrl}
      deferAllContentLoad={deferAllContentLoad}
    />
  )
}

export default ItemBoard
