import Board from "./Board"
import Loader from "../loading"
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

    const {data: allColumns, errorColumns} = useSWR("/api/columns")
    const {data: allItems, errorItems} = useSWR("/api/items")
    if (errorColumns) {
        return <Error error={errorColumns} statusCode={errorColumns.status}/>
    } else if (!allColumns || !allItems) {
        return <Loader/>
    } else if (errorItems) {
        return <Error error={errorItems} statusCode={errorItems.status}/>
    }

    if (!columns) {
        columns = allColumns
    } else if (columns.length > 0 && typeof columns[0] === "string") {
        columns = columns.map(id => allColumns.find(c => c._id === id))
    }
    if (items.length > 0 && typeof items[0] === "string") {
        items = items.map(id => allItems.find(i => i._id === id))
    }

    return <Board type={"item"} _id={_id} content={items} allContent={allItems} columns={columns}
                  updateContentURL={updateURL} updateContentKey={updateKey} deleteContentURL={deleteURL}
                  forceEditMode={forceEditMode} canMove={canMove}/>
}
