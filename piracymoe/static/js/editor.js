window.newRows = {}

// TODO: I don't want this workaround, make it a nice UI
// transforms siteAddresses-array to string and vice-versa
const workaroundAddressArray = (data, target = "array") => {
    if (Array.isArray(data) && target === "string") {
        return data.join(", ")
    } else if (typeof data === "string" && target === "array") {
        return data.split(", ")
    } else {
        return data
    }
}

const addTableRow = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Adding row to table", id)

    window.dataTables[id].addRow({}, false)
        .then(row => {
            if (!window.newRows[id]) {
                window.newRows[id] = [row]
            } else {
                window.newRows[id].push(row)
            }

            row.scrollTo()
        })
        .catch(e => {
            console.error("Failed to create new row for", id, "due to", e)
        })

}

const deleteSelectedRow = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Delete selected rows of table", id)

    window.dataTables[id].getSelectedRows().forEach(r => r.delete())
    document.querySelector("#delete-" + id).disabled = true
}

const isValidTable = (id) => {
    return !window.dataTables[id].getRows().some(r => {
        let d = r.getData()
        let invalid = !d["siteName"] || !d["siteAddresses"]
        if (!invalid) {
            d["siteAddresses"] = workaroundAddressArray(d["siteAddresses"], "array")
            invalid = d["siteAddresses"].some(site => !validateUrl(site)) || d["siteAddresses"].length === 0
        }

        if (invalid) {
            r.scrollTo()
        }
        return invalid
    })
}

const discardTableEdit = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Discarding edits to table", id)

    // undo all edited cells
    window.dataTables[id].getEditedCells().forEach(c => c.restoreInitialValue())
    if (window.newRows[id]) {
        window.newRows[id].forEach(r => r.delete())
    }
    resetTableEditState(id)
}

const setEditHistoryButtonState = (id) => {
    // for undo we need to check editedCells as well, due to DOM-Rendering triggering a data-change, which breaks history
    document.querySelector("#undo-" + id).disabled = (
        window.dataTables[id].getHistoryUndoSize() === 0 || window.dataTables[id].getEditedCells().length === 0
    )
    document.querySelector("#redo-" + id).disabled = (
        window.dataTables[id].getHistoryRedoSize() === 0
    )

    document.querySelector("#discard-" + id).disabled = (
        window.dataTables[id].getEditedCells().length === 0 && (!window.newRows[id] || window.newRows[id].length === 0)
    )
    document.querySelector("#save-" + id).disabled = (
        window.dataTables[id].getEditedCells().length === 0 || !isValidTable(id)
    )

    // checks if table has been edited or not
    if (!window.editedTables.includes(id) && window.dataTables[id].getEditedCells().length > 0) {
        window.editedTables.push(id)
    } else if (window.dataTables[id].getEditedCells().length === 0) {
        window.editedTables.filter(t => t !== id)
    }
}

const undoTableEdit = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Undo edit of table", id)

    window.dataTables[id].undo()
    setEditHistoryButtonState(id)
}

const redoTableEdit = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Redo edit of table", id)

    window.dataTables[id].redo()
    setEditHistoryButtonState(id)
}

const postUpdateData = (id, data, method = "update") => {
    console.log("[API] Method:", method, "for table:", id, data)
    fetch("/api/" + method + "/" + id, {
        credentials: "same-origin",
        mode: "same-origin",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
        .then(resp => {
            if (resp.status === 200) {
                return resp.text()
            } else {
                console.log("[API] Status: " + resp.status)
                return Promise.reject("api call failed")
            }
        })
        .then(result => {
            switch (result) {
                case "table does not exist":
                    return console.error("[API] Failed to find table:", id)
                case "received no POST JSON data":
                    return console.error("[API] No data sent on tableUpdate", id, data)
                case "id does not exist":
                    return console.error("[API] No ID could be found in table", id, data)
                case "updated":
                    return console.log("[API] Successfully updated row of table", id, data)
                case "inserted":
                    return console.log("[API] Successfully inserted row of table", id, data)
                default:
                    return console.error("[API] Unknown response", result, "for tableUpdate", id, data)
            }
        })
        .catch(err => {
            if (err !== "api call failed") {
                console.log(err)
            }
        })
}

const saveTableEdit = (el) => {
    const id = el.getAttribute("data-target")
    console.log("Saving table", id)
    let rows = window.dataTables[id].getEditedCells().map(c => c.getRow())
    if (!isValidTable(id)) {
        console.error("Illegal submit, missing name or url")
        return
    }

    // find update rows
    let uniques = new Set()
    let updateRows = rows.filter(r => {
        const duplicate = uniques.has(r)
        uniques.add(r)
        if (window.newRows[id]) {
            return !window.newRows[id].includes(r) && !duplicate
        }
        return !duplicate
    }).map(r => {
        let d = r.getData()
        d["siteAddresses"] = workaroundAddressArray(d["siteAddresses"], "array")
        return d
    })
    console.log("Update rows:", updateRows)

    // find new rows
    uniques = new Set()
    let newRows = rows.filter(r => {
        if (window.newRows[id]) {
            const duplicate = uniques.has(r)
            uniques.add(r)
            return window.newRows[id].includes(r) && !duplicate
        }
        return false
    }).map(r => {
        let d = r.getData()
        d["siteAddresses"] = workaroundAddressArray(d["siteAddresses"], "array")
        return d
    })
    console.log("Create new rows:", newRows)

    if (newRows.length === 0 && updateRows.length === 0) {
        console.error("What... abort")
        return
    }

    updateRows.forEach(data => postUpdateData(id, data))
    newRows.forEach(data => postUpdateData(id, data, "create"))

    // reset edit-history
    resetTableEditState(id)
    if (window.editedTables.includes(id)) {
        window.editedTables = window.editedTables.filter(t => t !== id)
    }
}

const resetTableEditState = (id) => {
    console.log("Resetting tableEdit of", id)
    window.dataTables[id].clearHistory()
    document.querySelector("#undo-" + id).disabled = true
    document.querySelector("#redo-" + id).disabled = true
    document.querySelector("#discard-" + id).disabled = true
    document.querySelector("#save-" + id).disabled = true
}

window.addEventListener('tablesGenerated', () => {
    if (editMode) {
        Object.keys(window.dataTables).forEach(id => {
            resetTableEditState(id)
        })
    }
})