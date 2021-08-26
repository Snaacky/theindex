import Board from "./Board"

export default function TableBoard(
    {
        _id,
        tables,
        allTables,
        updateURL = "/api/edit/tab/tables",
        updateKey = "tables",
        deleteURL = "",
        forceEditMode = false,
        canMove = true
    }) {
    return <Board type={"table"} _id={_id} content={tables} allContent={allTables} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove}/>
}
