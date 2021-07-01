import {readJSON} from "./data";

export function getColumns() {
    return readJSON("columns.json")
}
