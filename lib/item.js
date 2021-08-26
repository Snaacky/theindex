export function splitColumnsIntoTypes(columns, itemData) {
    let yes = [], no = [], array = [], text = []
    columns.forEach(c => {
        if (c.data) {
            c = c.data
        }
        if (c.type === "bool") {
            if (itemData[c._id] === true) {
                yes.push(c)
            } else if (itemData[c._id] === false) {
                no.push(c)
            }
        } else if (c.type === "array" && (itemData[c._id] || []).length > 0) {
            array.push(c)
        } else if (c.type === "text") {
            text.push(c)
        }
    })

    return {
        yes,
        no,
        array,
        text
    }
}
