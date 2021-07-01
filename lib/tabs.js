import {readJSON} from "./data";

export function getTabs() {
    return readJSON("data.json")
}
