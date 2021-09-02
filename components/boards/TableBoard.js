import Board from "./Board"
import Loader from "../loading"
import Error from "../../pages/_error"
import useSWR from "swr"

export default function TableBoard(
    {
        _id,
        tables,
        updateURL = "/api/edit/tab/tables",
        updateKey = "tables",
        deleteURL = "",
        forceEditMode = false,
        canMove = true
    }) {
    const {data: allTables, error} = useSWR("/api/tables")

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!allTables) {
        return <Loader/>
    }

    if (tables.length > 0 && typeof tables[0] === "string") {
        tables = tables.map(id => allTables.find(i => i._id === id)).filter(t => typeof t !== "undefined")
    }
    return <Board type={"table"} _id={_id} content={tables} allContent={allTables} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove}/>
}
