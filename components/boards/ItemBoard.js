import Board from "./Board"

export default function ItemBoard(
    {
        _id,
        items,
        allItems,
        columns,
        updateURL = "/api/edit/table/items",
        updateKey = "items",
        deleteURL = "",
        forceEditMode = false,
        canMove = true
    }) {
    return <Board type={"item"} _id={_id} content={items} allContent={allItems} columns={columns}
                  updateContentURL={updateURL} updateContentKey={updateKey} deleteContentURL={deleteURL}
                  forceEditMode={forceEditMode} canMove={canMove}/>
}
