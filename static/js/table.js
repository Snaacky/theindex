// formatter for cells
const render = (cell, formatterParams, onRendered) => {
    let data = ""
    if (Array.isArray(cell)) {
        cell.forEach(d => {
            data += '<span class="badge rounded-pill bg-success">' + d + '</span> '
        })
    } else if (typeof cell === "string") {
        data = cell
    } else {
        if (!cell || !cell.getValue()) {
            data = "?"
        } else {
            data = cell.getValue()
        }
    }

    const styleMap = {
        Y: {
            labelType: 'yes'
        },
        N: {
            labelType: 'no'
        },
        '?': {
            labelType: 'default'
        },
        '-': {
            labelType: 'default'
        }
    }


    const styles = styleMap[data]

    if (styles) {
        return '<kbd class="label-' + styles.labelType + '">' + data + '</kbd>'
    }

    return data
}

const resetColumns = (table) => {
    console.log("Resetting to default columns for ", table)
    window.columns["types"][tableById(table)["type"]].forEach(th => {
        if (th["key"] === "siteName") {
            return
        }

        let toggle = document.querySelector("#show-" + table + th['key'])
        if (toggle.checked === th["hidden"]) {
            toggle.checked = !toggle.checked
            toggleColumn(table, th["key"])
        }
    })

    setToggleAllState(table)
    window.dataTables[table].redraw(true)
}

const tableById = (table) => {
    if (!tablesReady) {
        console.error("Trying to get table", table, "but table-data not loaded")
        return false
    }
    return window.tables.map(tab => {
        return tab['tables'].filter(t => t["id"] === table)
    }).filter(t => t.length > 0)[0][0]
}

const exportTable = (format, id) => {
    window.dataTables[id].downloadToTab(format)
}

const onlineStatusToDot = (status) => {
    return '<div class="d-inline-block me-1 rounded-circle spinner-grow-sm ' + ((status) => {
        switch (status) {
            case "unknown":
                return "bg-warning"
            case "cloudflare":
                return "bg-warning"
            case "up":
                return "label-yes"
            case "online":
                return "label-yes"
            case "down":
                return "label-no"
            case "offline":
                return "label-no"
            default:
                return "bg-secondary spinner-grow"
        }
    })(status) + '" role="status"></div>'
}

const getColumnsDefinition = (table) => {
    let columnsShown = window.columns['types'][table["type"]].length
    let columnData = []

    if (window.editMode) {
        columnData.push({
            width: 30,
            minWidth: 30,
            cssClass: "cell-infoModal",
            formatter: "rowSelection",
            titleFormatter: "rowSelection",
            headerSort: false,
            cellClick: (e, cell) => {
                cell.getRow().toggleSelect();
            }
        })
    } else {
        columnData.push({
            width: 30,
            minWidth: 30,
            cssClass: "cell-infoModal",
            headerSort: false,
            tooltip: () => "Info",
            cellClick: (e, cell) => {
                console.log("info-click", e, cell)
                showInfoModal(cell.getRow())
            },
            formatter: () => '<i class="bi bi-info-circle"></i>'
        })
    }
    columnData.push({
        minWidth: 160,
        title: "Name",
        field: "siteName",
        hozAlign: "left",
        cssClass: "no-wrap",
        tooltip: cell => {
            let data = cell.getRow().getData()
            if (data["siteAddresses"]) {
                const url = workaroundAddressArray(data["siteAddresses"], "array")
                const status = window.online[url[0]]
                if (status === "online" || status === "offline") {
                    return data["siteName"] + " is " + window.online[url[0]]
                }
            }
            return "Status of " + data["siteName"] + " is unknown"
        },
        formatter: cell => {
            let data = cell.getRow().getData()
            const url = workaroundAddressArray(data["siteAddresses"], "array")
            let txt = onlineStatusToDot((url ? window.online[url[0]] : "unknown")) + ' '
            if (window.editMode) {
                if (!cell.getValue()) {
                    return txt + '<span class="text-warning">Animepiracy</span>'
                }
                return txt + cell.getValue()
            }
            return txt + '<a href="' + (url ? url[0] : "#") + '" target="_blank">' + cell.getValue() + '</a>'
        }
    })

    if (window.editMode) {
        columnData[1].editor = "input"
        columnData.push({
            minWidth: 240,
            title: propertyName("siteAddresses"),
            field: "siteAddresses",
            hozAlign: "left",
            editor: "input",
            formatter: cell => {
                let d = cell.getValue()
                if (!d) {
                    return '<span class="text-warning">https://piracy.moe</span>'
                }
                d = workaroundAddressArray(d, "array").map(url =>
                    validateUrl(url) ? url : '<span class="text-warning">' + url + '</span>'
                )
                return workaroundAddressArray(d, "string")
            }
        })
    }

    window.columns['types'][table["type"]].forEach(th => {
        if (th['key'] === "siteName") {
            return
        }
        if (th['hidden']) {
            columnsShown = columnsShown - 1
        }

        console.log("Column", propertyName(th['key']), "calcWidth", calcTextWidth(propertyName(th['key'])), "total", calcTextWidth(propertyName(th['key'])) + 5)
        let columnUpdate = {
            title: propertyName(th['key']),
            field: th['key'],
            visible: !th['hidden'],
            formatter: render,
            minWidth: (calcTextWidth(propertyName(th['key'])) + 9)
        }

        if (th["key"] === "editorNotes" || th["key"] === "siteFeatures") {
            columnUpdate.hozAlign = "left"
            columnUpdate.minWidth = 120
        }

        if (window.editMode) {
            if (window.columns["keys"][th["key"]]["type"] === "list") {
                columnUpdate.editor = "select"
                columnUpdate.editorParams = {
                    multiselect: true,
                    values: window.columns["keys"][th["key"]]["values"]
                }
            } else if (window.columns["keys"][th["key"]]["type"] === "check") {
                columnUpdate.editor = "tickCross"
                columnUpdate.editorParams = {
                    tristate: true,
                    indeterminateValue: "?"
                }
            } else {
                columnUpdate.editor = "input"
            }
        }

        columnData.push(columnUpdate)
    })

    return columnData
}

const generateTable = (table) => {
    console.log("Generating table", table)
    loadingLog()
    if (!window.tables || !window.columns) {
        console.error("Missing data: tables:", window.tables, "columns:", window.columns)
        return
    }

    if (!window.columns['types'][table["type"]]) {
        return console.error("Table type", table["type"], "could not be found")
    }


    // add column toggles
    let togglesString = ""
    window.columns['types'][table["type"]].forEach(th => {
        if (th['key'] === "siteName") {
            return
        }

        togglesString += '<div class="col">' +
            '<div class="form-check form-check-inline form-switch">' +
            '<input class="form-check-input" type="checkbox" id="show-' + table['id'] + th['key'] +
            '"' + (th['hidden'] ? '' : ' checked') + ' data-column="' + th['key'] + '" data-table="' +
            table['id'] + '"> <label class="form-check-label" for="show-' + table['id'] + th['key'] + '">' +
            propertyName(th['key']) + '</label>' +
            '</div></div>'
    })
    document.querySelector('#' + table['id'] + ' .toggle-row').innerHTML = togglesString

    try {
        window.dataTables[table['id']] = new Tabulator("#table-" + table['id'], {
            maxHeight: "75vh",
            layout: "fitColumns",
            placeholder: "No data has been found...",
            tooltipGenerationMode: "hover",
            headerHozAlign: "center",
            cellVertAlign: "middle",
            cellHozAlign: "center",
            columns: getColumnsDefinition(table),
            resizableColumns: false,
            history: true,
            ajaxURL: "/api/fetch/data/" + table['id'],
            ajaxResponse: (url, params, json) => {
                // TODO: create an array editor for siteAddresses...
                // this is a workaround atm
                if (window.editMode) {
                    json.forEach(r => r["siteAddresses"] = workaroundAddressArray(r["siteAddresses"], "string"))
                }
                window.rawData[table['id']] = json
                setTimeout(() => pingTable(table['id']), 1000)
                return json
            },
            dataChanged: () => {
                if (!window.editMode) {
                    return
                }

                console.log("Table", "#table-" + table['id'], "has been edited")
                if (window.dataTables[table['id']]) {
                    let undoSize = window.dataTables[table['id']].getHistoryUndoSize(),
                        redoSize = window.dataTables[table['id']].getHistoryRedoSize(),
                        editCells = window.dataTables[table['id']].getEditedCells().length
                    console.log("currently", undoSize, "undos and", redoSize, "redos available and", editCells, "edited Cells")

                    setEditHistoryButtonState(table['id'])
                } else if (tablesGenerated) {
                    console.error("Failed to access table-object of", table["id"])
                }
            },
            initialSort: [
                {column: "siteName", dir: "asc"}
            ],
            rowSelectionChanged: (d, rows) => {
                if (window.editMode) {
                    document.querySelector("#delete-" + table["id"]).disabled = rows.length === 0
                }
            }
        })
    } catch (e) {
        console.error("Yeah, failed to generate table", table["id"], "due to", e)
    }
}

const generateAllTables = () => {
    console.log("Populating tables with data, Status:")
    loadingLog()
    if (!tablesReady || !columnsReady || !domReady) {
        return
    }

    window.tables.forEach(tab => {
        tab['tables'].forEach(t => {
            document.querySelector('#' + tab["tab"]).innerHTML += '<div class="card mb-3" id="' + t['id'] + '">' +
                '<div class="card-header">' + t['title'] +
                '<span class="float-end d-flex justify-content-center">' +
                '<a class="text-decoration-none text-white collapsed" title="Show/Hide Columns" id="toggleFilter-' + t['id'] +
                '" data-bs-toggle="collapse" data-bs-target="#collapse-' + t['id'] + '" aria-expanded="false" ' +
                'aria-controls="search-filter" href="javascript:;"><i class="bi bi-toggles"></i></a>' +
                '</span></div>' +

                '<div class="card-body p-0"><div class="collapse" id="collapse-' + t['id'] + '">' +
                '<div class="card card-body"><div class="row g-3 align-items-center">' +

                '<div class="col-auto"><div class="form-check">' +
                '<input class="form-check-input" type="checkbox" id="toggleAll-' + t['id'] +
                '" data-table="' + t['id'] + '" data-toggle-type="all"> ' +
                '<label class="form-check-label" for="toggleAll-' + t['id'] + '">Toggle All</label>' +
                '</div></div>' +

                '<div class="col-auto">' +
                '<button type="button" class="btn btn-outline-danger" onclick="resetColumns(\'' + t['id'] + '\')">' +
                'Reset <i class="bi bi-trash"></i></button>' +
                '</div></div>' +
                '<div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 toggle-row"></div></div></div>' +
                '<div><div id="table-' + t['id'] + '"></div></div></div>' +
                '<div class="card-footer editor-only"' + (!window.editMode ? ' style="display: none;">' : '>') +
                '<button class="btn btn-success" data-target="' + t['id'] + '" onclick="addTableRow(this)">' +
                '<i class="bi bi-plus-circle"></i> Add row</button> ' +
                '<button disabled class="btn btn-danger" id="delete-' + t['id'] + '" data-target="' + t['id'] +
                '" onclick="deleteSelectedRow(this)">' +
                '<i class="bi bi-trash"></i> Delete row</button> ' +
                '<button disabled class="btn btn-danger" id="undo-' + t['id'] + '" data-target="' + t['id'] +
                '" onclick="undoTableEdit(this)">' +
                '<i class="bi bi-arrow-90deg-left"></i></button> ' +
                '<button disabled class="btn btn-danger" id="redo-' + t['id'] + '" data-target="' + t['id'] +
                '" onclick="redoTableEdit(this)">' +
                '<i class="bi bi-arrow-90deg-right"></i></button> ' +
                '<span class="float-end">' +
                '<button disabled class="btn btn-danger" id="discard-' + t['id'] + '" data-target="' + t['id'] +
                '" onclick="discardTableEdit(this)">' +
                '<i class="bi bi-trash"></i> Discard</button> ' +
                '<button disabled class="btn btn-success" id="save-' + t['id'] + '" data-target="' + t['id'] +
                '" onclick="saveTableEdit(this)">' +
                '<i class="bi bi-check2-circle"></i> Save</button>' +
                '</span></div></div>'
        })

        let download = '<div class="card">' +
            '<div class="card-header">Export Table-Data</div>' +
            '<div class="card-body p-0"><table class="table table-hover table-striped table-responsive table-dark mb-0"><tbody>'
        tab['tables'].forEach(t => {
            download += '<tr><td>' + t["title"] +
                '<span class="float-end d-flex justify-content-center">' +
                '<a class="text-decoration-none text-white me-3" title="Export as JSON" href="javascript:exportTable(\'json\', \'' + t["id"] + '\');">' +
                'JSON <i class="bi bi-cloud-download"></i></a>' +
                '<a class="text-decoration-none text-white me-3" title="Export as CSV" href="javascript:exportTable(\'csv\', \'' + t["id"] + '\');">' +
                'CSV <i class="bi bi-cloud-download"></i></a></span>' +
                '</td></tr>'
        })
        document.querySelector('#' + tab["tab"]).innerHTML += download + '</tbody></table></div></div>'
    })

    document.querySelector('#tablesList').style = ""
    window.tables.forEach(tab => {
        tab['tables'].forEach(t => {
            generateTable(t)
        })
    })
    tablesGenerated = true
    window.dispatchEvent(new Event("tablesGenerated"))

    document.querySelector('#loader').remove()

    // collapse of column selection
    window.tables.forEach(tab => {
        tab["tables"].forEach(table => {
            document.querySelectorAll('#collapse-' + table['id'] + ' input')
                .forEach(el => {
                    el.addEventListener('change', async () => toggleHandle(el))
                })

            // adjust toggleAll-state
            setToggleAllState(table['id'])
        })
    })
}


const countToggles = (table) => {
    return document.querySelectorAll("#collapse-" + table + " .toggle-row input").length
}

const countVisibleToggles = (table) => {
    let count = 0
    document.querySelectorAll("#collapse-" + table + " .toggle-row input").forEach(el => {
        if (el.checked) {
            count += 1
        }
    })

    return count
}

const setToggleAllState = (table) => {
    let visible = countVisibleToggles(table), toggle = document.querySelector("#toggleAll-" + table)
    console.log("Currently visible", visible, "of", countToggles(table), "in total in", table)
    if (visible === 0) {
        toggle.indeterminate = false
        toggle.checked = false
    } else if (visible === countToggles(table)) {
        toggle.indeterminate = false
        toggle.checked = true
    } else {
        toggle.indeterminate = true
    }
}

const toggleAll = (table) => {
    let state = document.querySelector("#toggleAll-" + table).checked
    console.log("Toggle all columns of table", table)
    document.querySelectorAll("#collapse-" + table + " div.row input").forEach(el => {
        if (el.checked !== state) {
            el.checked = state
            toggleColumn(table, el.getAttribute("data-column"), false)
        }
    })

    window.dataTables[table].redraw(true)
}

const toggleColumn = (table, key, update = true) => {
    console.log("Toggle visibility of column", key, "for table", table)
    window.dataTables[table].getColumn(key).toggle()

    if (update) {
        window.dataTables[table].redraw(true)
    }
}

const toggleHandle = (el) => {
    let table = el.getAttribute("data-table")
    if (el.getAttribute("data-toggle-type") === "all") {
        toggleAll(table)
    } else {
        toggleColumn(table, el.getAttribute("data-column"))
        setToggleAllState(table)
    }

    window.dataTables[table].redraw(true)
}

const generateColumnsDetails = () => {
    console.log("Trying to generate columns details in help tab")
    loadingLog()
    if (!columnsReady || !domReady) {
        return console.log("Columns aren't ready")
    }

    let accordion = ''
    Object.keys(window.columns["keys"]).forEach(key => {
        let column = window.columns["keys"][key]
        accordion += '<div class="col rounded hover-dark p-2">' +
            '<div class="row">' +
            '<div class="col-4">' +
            '<div class="badge hover-blue border border-primary py-1 px-2 rounded-pill">' + column["name"] + '</div>' +
            '</div>' +
            '<div class="col-8">' + column["description"] + '</div>' +
            '</div>' +
            '</div>'
    })

    let el = document.querySelector('#columnsDetails')
    if (el) {
        el.innerHTML = accordion
    } else {
        console.log("No help tab found, skipping")
    }
}

window.addEventListener("beforeunload", (e) => {
    if (window.editedTables.length > 0) {
        e.preventDefault()
        let text = "Unsaved changes for table(s):\n"
        window.editedTables.forEach(t => {
            text += tableById(t).title + "\n"
        })
        e.returnValue = text
    }
})
