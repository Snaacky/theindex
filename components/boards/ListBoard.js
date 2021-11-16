import Board from './Board'
import Loader from '../loading'
import useSWR from 'swr'

export default function ListBoard({
  uid,
  lists,
  allLists,
  updateURL = '',
  updateKey = 'lists',
  deleteURL = '/api/delete/list',
  forceEditMode = false,
  canMove = false,
  canEdit = false,
}) {
  return (
    <Board
      type={'list'}
      _id={uid}
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
