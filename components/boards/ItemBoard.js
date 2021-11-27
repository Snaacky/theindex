import Board from './Board'
import useSWR from 'swr'
import Loader from '../loading'

export default function ItemBoard({
  _id,
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
}) {
  items = items.filter((i) => typeof i !== 'undefined' && i !== null)
  const sponsoredItems = showSponsors ? items.filter((i) => i.sponsor) : []

  return (
    <Board
      type={'item'}
      _id={_id}
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
    />
  )
}
