import Board from "./Board"
import useSWR from "swr"
import Loader from "../loading"

export default function ItemBoard(
    {
        _id,
        items,
        columns,
        updateURL = "/api/edit/collection",
        updateKey = "items",
        deleteURL = "",
        forceEditMode = false,
        canMove = false,
        canEdit = false
    }) {

    const {data: allColumns} = useSWR("/api/columns")
    const {data: allItems} = useSWR("/api/items")
    if (!allColumns || !allItems) {
        return <Loader/>
    }

    if (!columns) {
        columns = allColumns
    } else if (columns.length > 0 && typeof columns[0] === "string") {
        columns = columns.map(id => allColumns.find(c => c._id === id)).filter(c => typeof c !== "undefined")
    }
    if (items.length > 0 && typeof items[0] === "string") {
        items = items.map(id => allItems.find(i => i._id === id)).filter(i => typeof i !== "undefined")
    }

    const sponsored = items.filter(i => i.sponsor)
    if (sponsored.length > 0) {
        items = sponsored.concat(items.filter(i => !i.sponsor))
    }

    return <Board type={"item"} _id={_id} content={items} allContent={allItems} columns={columns}
                  updateContentURL={updateURL} updateContentKey={updateKey} deleteContentURL={deleteURL}
                  forceEditMode={forceEditMode} canMove={canMove} canEdit={canEdit}/>
}
