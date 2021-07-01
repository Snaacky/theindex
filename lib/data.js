import fs from 'fs'
import path from 'path'

export function readJSON(file) {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', file)))
}
