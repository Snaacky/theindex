import CardRowBoard from "./CardRowBoard"

export default function TableBoard(
    {
        _id,
        tables,
        allTables,
        updateURL = "/api/edit/tab/tables",
        updateKey = "tables",
        deleteURL = "",
    }) {
    return <CardRowBoard type={"table"} _id={_id} content={tables} allContent={allTables} updateContentURL={updateURL}
                         updateContentKey={updateKey} deleteContentURL={deleteURL}/>
}
