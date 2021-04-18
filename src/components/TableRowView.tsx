import React from "react";
import {Form} from "react-bootstrap";
import {TableColumnData} from "../api/Interfaces";
import "./TableRowView.css";

interface TableRowViewProps {
    id: number,
    data: any,
    editMode: boolean,
    tableId: number,
    columns: TableColumnData[]
}

interface TableRowViewState {
    data: any
}

class TableRowView extends React.Component<TableRowViewProps> {
    state: TableRowViewState;

    constructor(props: TableRowViewProps) {
        super(props);

        this.state = {
            data: this.props.data
        };
    }

    updateData(data: any, cId: number): void {
        const c = this.props.columns.filter((c: TableColumnData) => c.id === cId)[0];
        // console.log("Update data of column", c.key, "to", data);

        // we need to adjust this manually to prevent unreferencing the columns
        const d = this.state.data;
        d[c.key] = data;
        this.setState({data: d});
    }

    checkCell(data: boolean, cId: number): JSX.Element {
        if (this.props.editMode) {
            return (
                <div style={{color: data ? "rgb(95, 176, 51)" : "rgb(206, 52, 76)"}}>
                    <Form.Check custom
                                type={"checkbox"}
                                checked={data}
                                onChange={(d) => this.updateData(d.target.checked, cId)}
                                id={`data-edit-${this.props.tableId}-${this.props.id}-${cId}`}
                                label={data ? "Y" : "N"}/>
                </div>
            );
        }

        return (
            <kbd style={{color: data ? "rgb(95, 176, 51)" : "rgb(206, 52, 76)"}}>
                {data ? "Y" : "N"}
            </kbd>
        );
    }

    textCell(data: string, cId: number): JSX.Element {
        if (this.props.editMode) {
            return (
                <Form.Control type={"text"}
                              size={"sm"}
                              className={"custom"}
                              onChange={(d) => this.updateData(d, cId)}
                              id={`data-edit-${this.props.tableId}-${this.props.id}-${cId}`}
                              defaultValue={data}
                              placeholder={"?"}/>
            );
        }

        return (
            <>
                {data ? data : "---"}
            </>
        );
    }

    listCell(data: any, cId: number): JSX.Element {
        // console.log("Trying to access list column", cId, data);
        return this.textCell(data, cId);
        /*
        if (this.props.editMode) {
            return (
                <>
                    {data.map((d: string) => {
                        return (
                            <Badge pill variant={"primary"}>
                                {d}
                            </Badge>
                        );
                    })}
                </>
            );
        }

        return (
            <>
                {data.map((d: string) => {
                    return (
                        <Badge pill variant={"primary"}>
                            {d}
                        </Badge>
                    );
                })}
            </>
        );
        */
    }

    cellFormatter(data: any, col: TableColumnData): string | JSX.Element {
        switch (col.columnType) {
            case "text": {
                return this.textCell(data as string, col.id);
            }
            case "check": {
                return this.checkCell(data as boolean, col.id);
            }
            case "list": {
                return this.listCell(data, col.id);
            }
            default: {
                // throw NotImplementedException();
                return (<>Error</>);
            }
        }
    }

    render(): JSX.Element {
        const expanded = this.state.data;
        return (
            <tr>
                {this.props.columns.filter((c) => c.hidden === false).map((c: TableColumnData) => {
                    return (
                        <td key={c.id} className={"align-items-start"}>
                            {this.cellFormatter(expanded[c.key as keyof typeof expanded], c)}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default TableRowView;
