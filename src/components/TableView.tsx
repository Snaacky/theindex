import React from "react";
import {TableColumnData, TableData, TableRowData} from "../api/Interfaces";
import {Card, Table} from "react-bootstrap";
import TableRowView from "./TableRowView";

interface TableViewProps {
    table: TableData
}

class TableView extends React.Component<TableViewProps> {
    render() {
        let sortedColumns = this.props.table.columns.sort((a, b) => a.order > b.order ? 1 : -1)
        return (
            <Card className={"mb-3"} style={{backgroundColor: "#121212"}}>
                <Card.Header>
                    {this.props.table.name}
                </Card.Header>
                <Card.Body className={"p-0"} style={{backgroundColor: "#202020"}}>
                    <Table striped responsive hover variant="dark" className={"mb-0"}>
                        <thead>
                        <tr style={{backgroundColor: "rgb(18, 18, 18)"}}>
                            {sortedColumns.map((c: TableColumnData) => {
                                return (
                                    <th key={c.id} style={{fontWeight: 500}}>
                                        {c.name}
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.table.data.map((d: TableRowData) => {
                            return (
                                <TableRowView key={d.id} row={d} columns={sortedColumns}/>
                            );
                        })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }
}

export default TableView;