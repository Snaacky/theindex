import React from "react";
import {TableColumnData, TableData, TableRowData} from "../api/Interfaces";
import {Card, Collapse, Table} from "react-bootstrap";
import TableColumnTogglesView from "./TableColumnTogglesView";
import ToggleColumnsButton from "./ToggleColumnsButton";
import TableRowView from "./TableRowView";

interface TableViewProps {
    table: TableData,
    editMode: boolean,
    search: string
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

    cloneShallow(cols: TableColumnData[]): TableColumnData[] {
        // clone required to not overwrite the original state for resetting
        const result: TableColumnData[] = [];
        cols.forEach(c => {
            result.push({
                id: c.id,
                name: c.name,
                key: c.key,
                description: c.description,
                columnId: c.columnId,
                tableId: c.tableId,
                columnType: c.columnType,
                order: c.order,
                hidden: c.hidden
            } as TableColumnData);
        });
        return result;
    }

    toggleColumn(cols: TableColumnData[]): void {
        this.setState({cols});
    }

    resetColumn(): void {
        // we need to adjust this manually to prevent unreferencing the columns
        const cols = this.state.cols;
        this.props.table.columns.forEach((c, i) => {
            cols[i].hidden = c.hidden;
        });
        this.setState({cols: cols});
    }

    sortColumns(): TableColumnData[] {
        return this.state.cols.sort((a, b) => a.order > b.order ? 1 : -1);
    }

    render(): JSX.Element {
        const sorted = this.sortColumns();
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
                        <div>
                            <TableColumnTogglesView
                                cols={sorted}
                                toggleColumn={this.toggleColumn.bind(this)}
                                resetColumn={this.resetColumn.bind(this)}
                                tableId={this.props.table.id}/>
                        </div>
                    </Collapse>
                    <Table variant="dark" className={"mb-0"}>
                        <thead>
                        <tr>
                            {sorted.filter((c) => !c.hidden).map((c: TableColumnData) => {
                                return (
                                    <th key={c.id}>
                                        {c.name}
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.table.data.map((d: TableRowData) => {
                            return {
                                id: d.id,
                                data: JSON.parse(d.data)
                            };
                        }).filter((d) => {
                            return d.data[sorted[0].key as keyof typeof d.data]
                                .toLowerCase().indexOf(this.props.search) !== -1;
                        }).map((d: any) => {
                            return (
                                <TableRowView key={d.id}
                                              id={d.id}
                                              editMode={this.props.editMode}
                                              tableId={this.props.table.id}
                                              data={d.data}
                                              columns={sorted}/>
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
