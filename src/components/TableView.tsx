import React from "react";
import {TableColumnData, TableData, TableRowData} from "../api/Interfaces";
import {Card, Collapse, Table} from "react-bootstrap";
import TableRowView from "./TableRowView";
import TableColumnTogglesView from "./TableColumnTogglesView";
import ToggleColumnsButton from "./ToggleColumnsButton";

interface TableViewProps {
    table: TableData
}

interface TableViewState {
    cols: TableColumnData[],
    toggleColumnsExpanded: boolean
}

class TableView extends React.Component<TableViewProps> {
    state: TableViewState;

    constructor(props: TableViewProps) {
        super(props);

        this.state = {
            cols: this.cloneShallow(this.props.table.columns),
            toggleColumnsExpanded: false,
        };
    }

    cloneShallow(cols: TableColumnData[]) {
        // clone required to not overwrite the original state for resetting
        let result: TableColumnData[] = [];
        cols.forEach(c => {
            result.push({
                id: c.id,
                name: c.name,
                key: c.key,
                description: c.description,
                column_id: c.column_id,
                table_id: c.table_id,
                column_type: c.column_type,
                order: c.order,
                hidden: c.hidden
            } as TableColumnData)
        });
        return result;
    }

    toggleColumn(cols: TableColumnData[]) {
        this.setState({cols: cols});
    }

    resetColumn() {
        // we need to adjust this manually to prevent unreferencing the columns
        let cols = this.state.cols;
        this.props.table.columns.forEach((c, i) => {
            cols[i].hidden = c.hidden;
        });
        this.setState({cols: cols});
    }

    sortColumns() {
        return this.state.cols.sort((a, b) => a.order > b.order ? 1 : -1)
    }

    render() {
        let sorted = this.sortColumns();
        return (
            <Card className={"mt-3"} style={{backgroundColor: "#121212"}}>
                <Card.Header className={"d-flex"}>
                    <div>
                        {this.props.table.name}
                        <small className={"ml-1 text-muted"}>
                            {this.props.table.description}
                        </small>
                    </div>
                    <span
                        className={"ml-auto"}
                        style={{
                            lineHeight: 1
                        }}
                    >
                        <ToggleColumnsButton
                            toggled={this.state.toggleColumnsExpanded}
                            onClick={() => this.setState({toggleColumnsExpanded: !this.state.toggleColumnsExpanded})}
                        />
                    </span>
                </Card.Header>
                <Card.Body className={"p-0"} style={{backgroundColor: "#202020"}}>
                    <Collapse in={this.state.toggleColumnsExpanded}>
                        <TableColumnTogglesView
                            cols={sorted}
                            toggleColumn={this.toggleColumn.bind(this)}
                            resetColumn={this.resetColumn.bind(this)}
                            tableId={this.props.table.id}/>
                    </Collapse>
                    <Table striped responsive hover variant="dark" className={"mb-0"}>
                        <thead>
                        <tr style={{backgroundColor: "rgb(18, 18, 18)"}}>
                            {sorted.filter((c) => !c.hidden).map((c: TableColumnData) => {
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
                                <TableRowView key={d.id} row={d} columns={sorted}/>
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