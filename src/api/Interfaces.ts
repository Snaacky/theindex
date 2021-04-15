export interface TabData {
    id: number,
    name: string,
    description: string,
    tables: number[]
}

export interface TableData {
    id: number,
    name: string,
    description: string,
    tab_id: number,
    data: TableRowData[],
    columns: TableColumnData[]
}

export interface TableColumnData {
    id: number,
    name: string,
    key: string,
    description: string,
    column_id: number,
    table_id: number,
    column_type: number,
    order: number,
    hidden: boolean
}

export interface TableRowData {
    id: number,
    data: string,
    table_id: number
}