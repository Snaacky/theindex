import fs from 'fs'
import path from 'path'

export function getColumns() {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'columns.json')))
}