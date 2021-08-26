import Board from "./Board"

export default function TabBoard(
    {
        _id,
        tabs,
        allTabs,
        updateURL = "/api/edit/tab/order",
        updateKey = "tabs",
        deleteURL = "/api/delete/tab",
        forceEditMode = false,
        canMove = true
    }) {
    return <Board type={"tab"} _id={_id} content={tabs} allContent={allTabs} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove}/>
}
