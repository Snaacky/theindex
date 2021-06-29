import fs from 'fs'
import path from 'path'

export function getTabs() {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data.json')))
}