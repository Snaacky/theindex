import fs from "fs"
import path from "path"

export function readJSON(file) {
    /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", file)))
}
