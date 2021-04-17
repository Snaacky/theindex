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
    tabId: number,
    data: TableRowData[],
    columns: TableColumnData[]
}

export interface TableColumnData {
    id: number,
    name: string,
    key: string,
    description: string,
    columnId: number,
    tableId: number,
    columnType: number,
    order: number,
    hidden: boolean
}

export interface TableRowData {
    id: number,
    data: string,
    tableId: number
}