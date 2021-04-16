import React from "react";
import {TableColumnData} from "../api/Interfaces";

interface TableColumnTogglesViewProps {
    cols: TableColumnData[],
    toggleColumn: (cols: TableColumnData[]) => void
}

class TableColumnTogglesView extends React.Component<TableColumnTogglesViewProps> {
    render() {
        return (
            <div>

            </div>
        );
    }
}

export default TableColumnTogglesView;
