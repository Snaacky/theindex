import React from "react";
import {TableColumnData, TableRowData} from "../api/Interfaces";

interface TableRowViewProps {
    row: TableRowData,
    columns: TableColumnData[]
}

class TableRowView extends React.Component<TableRowViewProps> {
    render() {
        let expanded = JSON.parse(this.props.row.data);
        return (
            <tr style={{backgroundColor: (this.props.row.id % 2 === 0 ? "rgb(22, 22, 22)" : "rgb(18, 18, 18)")}}>
                {this.props.columns.map((c: TableColumnData) => {
                    return (
                        <td key={c.id} className={"align-items-start"}>
                            {cellFormatter(expanded[c.key as keyof typeof expanded])}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

const cellFormatter = (data: any) => {
    if (typeof data === "boolean") {
        return (
            <kbd style={{
                backgroundColor: "#0d0d0d",
                padding: ".15rem 0.7rem",
                fontSize: "1rem",
                color: (data ? "rgb(95, 176, 51)" : "rgb(206, 52, 76)")
            }}>
                {data ? "Y" : "N"}
            </kbd>
        );
    } else if (typeof data === "string") {
        return data
    }

    return (
        <kbd
            style={{backgroundColor: "#0d0d0d", padding: ".15rem 0.7rem", fontSize: "1rem"}}>
            ?
        </kbd>
    );
}

export default TableRowView;