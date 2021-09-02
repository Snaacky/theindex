import Board from "./Board"

export default function ColumnBoard(
    {
        _id,
        columns,
        allColumns,
        updateURL = "/api/edit/table",
        updateKey = "columns",
        deleteURL = "",
        forceEditMode = false,
        canMove = true,
        canEdit = false
    }) {
    return <Board type={"column"} _id={_id} content={columns} allContent={allColumns} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove} canEdit={canEdit}/>
}
