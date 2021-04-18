import React from "react";
import {TableColumnData} from "../api/Interfaces";
import "./TableRowView.css";

interface TableRowViewProps {
    data: any,
    columns: TableColumnData[]
}

class TableRowView extends React.Component<TableRowViewProps> {
    cellFormatter(data: any): string | JSX.Element {
        if (typeof data === "string") {
            return data;
        }

        let output = "?", color = "inherit";
        if (typeof data === "boolean") {
            output = data ? "Y" : "N";
            color = data ? "rgb(95, 176, 51)" : "rgb(206, 52, 76)";
        }

        return (
            <kbd style={{color: color}}>
                {output}
            </kbd>
        );
    }

    render(): JSX.Element {
        const expanded = this.props.data;
        return (
            <tr>
                {this.props.columns.filter((c) => c.hidden === false).map((c: TableColumnData) => {
                    return (
                        <td key={c.id} className={"align-items-start"}>
                            {this.cellFormatter(expanded[c.key as keyof typeof expanded])}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default TableRowView;
