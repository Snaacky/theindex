import Board from "./Board"
import useSWR from "swr"
import Error from "../../pages/_error"

export default function ItemBoard(
    {
        _id,
        items,
        columns,
        updateURL = "/api/edit/table/items",
        updateKey = "items",
        deleteURL = "",
        forceEditMode = false,
        canMove = true
    }) {

    let {data: allColumns, errorColumns} = useSWR("/api/columns")
    let {data: allItems, errorItems} = useSWR("/api/items")
    if (errorColumns) {
        return <Error error={errorColumns} statusCode={errorColumns.status}/>
    } else if (errorItems) {
        return <Error error={errorItems} statusCode={errorItems.status}/>
    }
    allColumns = allColumns || []
    allItems = allItems || []

    if (!columns) {
        columns = allColumns
    } else if (columns.length > 0 && typeof columns[0] === "string") {
        columns = columns.map(id => allColumns.find(c => c._id === id)).filter(c => typeof c !== "undefined")
    }
    if (items.length > 0 && typeof items[0] === "string") {
        items = items.map(id => allItems.find(i => i._id === id)).filter(i => typeof i !== "undefined")
    }

    return <Board type={"item"} _id={_id} content={items} allContent={allItems} columns={columns}
                  updateContentURL={updateURL} updateContentKey={updateKey} deleteContentURL={deleteURL}
                  forceEditMode={forceEditMode} canMove={canMove}/>
}
