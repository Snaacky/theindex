import React from "react";
import {TableColumnData, TableData, TableRowData} from "../api/Interfaces";
import {Card, Table} from "react-bootstrap";
import TableRowView from "./TableRowView";
import TableColumnTogglesView from "./TableColumnTogglesView";
import Accordion from "react-bootstrap/Accordion";
import {BsToggles} from "react-icons/all";

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
            cols: props.table.columns,
            toggleColumnsExpanded: false,
        };
    }

    toggleColumn(cols: TableColumnData[]) {
        this.setState({cols: cols});
    }

    toggleExpandColumnsToggleView() {
        this.setState({toggleColumnsExpanded: !this.state.toggleColumnsExpanded});
    }

    render() {
        let sortedColumns = this.props.table.columns.sort((a, b) => a.order > b.order ? 1 : -1)
        return (
            <Card className={"mb-3"} style={{backgroundColor: "#121212"}}>
                <Card.Header>
                    {this.props.table.name}
                    <span className={"float-end d-flex justify-content-center"}>
                        <button
                            type="button"
                            style={{transform: this.state.toggleColumnsExpanded ? "rotate(180deg)" : "rotate(0deg)"}}
                            onClick={this.toggleExpandColumnsToggleView.bind(this)}
                        >
                            <BsToggles/>
                        </button>
                    </span>
                </Card.Header>
                <Card.Body className={"p-0"} style={{backgroundColor: "#202020"}}>
                    <Accordion.Collapse eventKey={"s"}>
                        <TableColumnTogglesView cols={this.state.cols} toggleColumn={this.toggleColumn}/>
                    </Accordion.Collapse>
                    <Table striped responsive hover variant="dark" className={"mb-0"}>
                        <thead>
                        <tr style={{backgroundColor: "rgb(18, 18, 18)"}}>
                            {sortedColumns.filter((c) => !c.hidden).map((c: TableColumnData) => {
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