import Board from './Board'

export default function LibraryBoard({
  _id,
  libraries,
  allLibraries,
  updateURL = '/api/edit/library/order',
  updateKey = 'libraries',
  deleteURL = '/api/delete/library',
  forceEditMode = false,
  canMove = true,
  canEdit = false,
}) {
  return (
    <Board
      type={'library'}
      _id={_id}
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
