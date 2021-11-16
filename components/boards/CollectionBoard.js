import Board from './Board'
import Loader from '../loading'
import useSWR from 'swr'

export default function CollectionBoard({
  _id,
  collections,
  allCollections,
  updateURL = '/api/edit/library',
  updateKey = 'collections',
  deleteURL = '',
  forceEditMode = false,
  canMove = true,
  canEdit = false,
}) {
  return (
    <Board
      type={'collection'}
      _id={_id}
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
