import {getAll} from "./db";

export async function getColumns() {
    return await getAll("columns")
}
