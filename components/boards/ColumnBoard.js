import CardRowBoard from "./CardRowBoard"

export default function ColumnBoard(
    {
        _id,
        columns,
        allColumns,
        updateURL = "/api/edit/table/columns",
        updateKey = "columns",
        deleteURL = "",
    }) {
    return <CardRowBoard type={"column"} _id={_id} content={columns} allContent={allColumns} updateContentURL={updateURL}
                         updateContentKey={updateKey} deleteContentURL={deleteURL}/>
}
