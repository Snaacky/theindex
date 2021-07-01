import {readJSON} from "./data";

export function getError(statusCode) {
    return readJSON("error.json")[statusCode]
}
