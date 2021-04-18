import {TableColumnData} from "../api/Interfaces";
import React from "react";
import {Col, Form} from "react-bootstrap";

interface ToggleColumnButtonProps {
    col: TableColumnData,
    toggleColumn: (col: TableColumnData) => void
}

class ToggleColumnButton extends React.Component<ToggleColumnButtonProps> {
    render(): JSX.Element {
        return (
            <Col>
                <Form.Check
                    custom
                    type={"switch"}
                    id={this.props.col.tableId + "-" + this.props.col.id}
                    checked={!this.props.col.hidden}
                    title={this.props.col.description}
                    label={this.props.col.name}
                    onChange={() => this.props.toggleColumn(this.props.col)}
                />
            </Col>
        );
    }
}

export default ToggleColumnButton;
