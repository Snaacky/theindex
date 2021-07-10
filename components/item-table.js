import BoolValue from "./bool-value";
import ArrayValue from "./array-value";

export default function ItemTable({columns, items, canEdit = false}) {
    items = items.filter(i => i.show).map(i => i.data)
    return <div className={"table-responsive"}>
        <table className={"table table-dark table-striped table-hover"}>
            <thead>
            <tr>
                <th scope={"col"}>
                    Name
                </th>
                {items.map(i => <th key={i._id} className={"text-center"}>
                    <a href={i.urls[0]} target={"_blank"} rel="noreferrer">
                        {i.title}
                    </a>
                </th>)}
                {items.length === 0 ? <th>
                    No items found
                </th> : <></>}
            </tr>
            </thead>

            <tbody>
            {columns.map(c => tableRow(c.data, items))}
            {columns.length === 0 ? <tr>
                <th>
                    No columns found
                </th>
            </tr> : <></>}
            </tbody>
        </table>
    </div>
}

function tableRow(column, items) {
    return <tr>
        <th scope={"col"}>
            {column.title}
        </th>
        {items.map(i => <td key={i._id + "-" + column._id} className={"text-center"}>
            {(
                column.type === "bool" ?
                    <BoolValue value={i.data[column._id]}/>
                    : <ArrayValue value={i.data[column._id]}/>
            )}
        </td>)}
    </tr>
}
