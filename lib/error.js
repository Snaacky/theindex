import {readJSON} from "./data"

export function getError(statusCode) {
    const errors = readJSON("error.json")
    if (statusCode in errors) {
        return errors[statusCode]
    }

    return {
        "text": "An unknown error occurred",
        "img": "/img/puzzled.png",
        "imgAlt": "Puzzled Kanna"
    }
}
