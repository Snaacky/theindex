import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {BsTrash} from "react-icons/all";
import {TableColumnData} from "../api/Interfaces";
import ToggleColumnButton from "./ToggleColumnButton";

interface TableColumnTogglesViewProps {
    tableId: number,
    cols: TableColumnData[],
    toggleColumn: (cols: TableColumnData[]) => void,
    resetColumn: () => void
}

class TableColumnTogglesView extends React.Component<TableColumnTogglesViewProps> {
    indeterminate(): boolean {
        return this.props.cols.some((c: TableColumnData) => c.hidden && c.order > 0) &&
            this.props.cols.some((c: TableColumnData) => !c.hidden && c.order > 0);
    }

    checked(): boolean {
        return !this.props.cols.some((c: TableColumnData) => c.hidden && c.order > 0);
    }

    clicked(): TableColumnData | void {
        const hide: boolean = this.checked();
        this.props.toggleColumn(this.props.cols.map((c: TableColumnData) => {
            if (c.order > 0) {
                c.hidden = hide;
            }
            return c;
        }));
    }

    toggle(col: TableColumnData): TableColumnData | void {
        this.props.toggleColumn(this.props.cols.map((c: TableColumnData) => {
            if (c.id === col.id) {
                c.hidden = !c.hidden;
            }
            return c;
        }));
    }

    render(): JSX.Element {
        return (
            <div className={"card card-body"} style={{backgroundColor: "#202020"}}>
                <Row>
                    <Col xs={"auto"} className={"my-auto"}>
                        <Form.Check
                            custom
                            checked={this.checked()}
                            type={"checkbox"}
                            id={"toggle-all-" + this.props.tableId}
                            ref={(el: HTMLInputElement) => el && (el.indeterminate = this.indeterminate())}
                            label={"Toggle all"}
                            onChange={this.clicked.bind(this)}
                        />
                    </Col>
                    <Col xs={"auto"}>
                        <Button variant="outline-danger" onClick={this.props.resetColumn}>
                            Reset <BsTrash/>
                        </Button>
                    </Col>
                </Row>
                <Row className={"row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5"}>
                    {
                        this.props.cols.map((c: TableColumnData) => {
                            if (c.order > 0) {
                                return (
                                    <ToggleColumnButton col={c}
                                                        toggleColumn={this.toggle.bind(this)}
                                                        key={c.id}/>
                                );
                            }
                        })
                    }
                </Row>
            </div>
    );
    }
    }

    export default TableColumnTogglesView;
