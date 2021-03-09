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
        if (!cell.getValue()) {
            cell.setValue('?')
        }
        data = cell.getValue()
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

const generateTable = (table, data) => {
    console.log("Generating table", table)
    loadingLog()
    if (!window.tables || !window.columns) {
        console.error("Missing data: tables:", window.tables, "columns:", window.columns)
        return
    }
    let columnsShown = window.columns['types'][table["type"]].length
    let columnData = []

    if (editMode) {
        columnData.push({
            width: 30,
            minWidth: 30,
            hozAlign: "center",
            resizable: false,
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
            hozAlign: "center",
            resizable: false,
            cssClass: "cell-infoModal",
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
        cssClass: "no-wrap site-name",
        tooltip: cell => {
            let data = cell.getRow().getData()
            let status = window.online[data["siteName"]]
            if (status === "online" || status === "offline") {
                return data["siteName"] + " is " + window.online[data["siteName"]]
            }
            return "Status of " + data["siteName"] + " is " + (status === "unknown" ? "unknown" : "undetermined")
        },
        formatter: cell => {
            if (editMode) {
                return cell.getValue()
            }

            let data = cell.getRow().getData()
            let status = '<div class="d-inline-block rounded-circle spinner-grow-sm '
            switch (window.online[data["siteName"]]) {
                case "unknown":
                    status += "bg-warning"
                    break
                case "online":
                    status += "label-yes"
                    break
                case "offline":
                    status += "label-no"
                    break
                default:
                    status += "bg-secondary spinner-grow"
            }
            return status + '" id="online-' + cssSafe(data["siteName"]) + '" role="status"></div> ' +
                '<a href="' + data.siteAddresses[0] + '" target="_blank">' + cell.getValue() + '</a>'
        },
        cellClick: (e, cell) => {
            if (editMode) {
                return
            }

            let data = cell.getRow().getData()
            window.open(data.siteAddresses[0], '_blank')
            // this may work or may not... it's from browser to browser and from version to version different :/
            window.focus();
        }
    })

    if (editMode) {
        columnData[1].editor = "input"
        columnData.push({
            title: propertyName("siteAddresses"),
            field: "siteAddresses",
            headerHozAlign: "center",
            editor: "input"
        })
    }

    // add column toggles
    let togglesString = ""
    try {
        window.columns['types'][table["type"]].forEach(th => {
            if (th['key'] === "siteName") {
                return
            }
            if (th['hidden']) {
                columnsShown = columnsShown - 1
            }

            togglesString += '<div class="col">' +
                '<div class="form-check form-check-inline form-switch">' +
                '<input class="form-check-input" type="checkbox" id="show-' + table['id'] + th['key'] +
                '"' + (th['hidden'] ? '' : ' checked') + ' data-column="' + th['key'] + '" data-table="' +
                table['id'] + '"> <label class="form-check-label" for="show-' + table['id'] + th['key'] + '">' +
                propertyName(th['key']) + '</label>' +
                '</div></div>'

            let columnUpdate = {
                title: propertyName(th['key']),
                field: th['key'],
                visible: !th['hidden'],
                hozAlign: "center",
                headerHozAlign: "center",
                formatter: render
            }

            if (editMode) {
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
    } catch (e) {
        console.error("Table type", table["type"], "could not be found", e)
    }
    document.querySelector('#' + table['id'] + ' .toggle-row').innerHTML = togglesString

    try {
        window.dataTables[table['id']] = new Tabulator("#table-" + table['id'], {
            maxHeight: "75vh",
            layout: "fitColumns",
            placeholder: "No data has been found...",
            tooltipGenerationMode: "hover",
            columns: columnData,
            resizableColumns: false,
            history: true,
            data: data,
            dataChanged: () => {
                if (!editMode) {
                    return
                }

                console.log("Table", "#table-" + table['id'], "has been edited")
                if (window.dataTables[table['id']]) {
                    let undoSize = window.dataTables[table['id']].getHistoryUndoSize(),
                        redoSize = window.dataTables[table['id']].getHistoryRedoSize()
                    console.log("currently", undoSize, "undos and", redoSize, "redos available")

                    document.querySelector("#discard-" + table['id']).disabled = undoSize === 0
                    document.querySelector("#save-" + table['id']).disabled = undoSize === 0

                    if (undoSize > 0) {
                        if (!window.editedTables.includes(table["id"])) {
                            window.editedTables.push(table["id"])
                        }
                    } else {
                        if (window.editedTables.includes(table["id"])) {
                            window.editedTables = window.editedTables.filter(t => t !== table["id"])
                        }
                    }

                    document.querySelector("#undo-" + table["id"]).disabled = undoSize === 0
                    document.querySelector("#redo-" + table["id"]).disabled = redoSize === 0
                } else if (tablesGenerated) {
                    console.error("Failed to access table-object of", table["id"])
                }
            },
            initialSort: [
                {column: "siteName", dir: "asc"}
            ],
            rowSelectionChanged: (d, rows) => {
                if (editMode) {
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
    if (!tablesReady || !dataReady || !columnsReady || !domReady) {
        return
    }

    // clone data to be displayed in #infoModal
    let data = JSON.parse(JSON.stringify(window.rawData))

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
                (editMode ? '<div class="card-footer">' +
                    '<button class="btn btn-success" data-target="' + t['id'] + '" onclick="javascript:addTableRow(this);">' +
                    '<i class="bi bi-plus-circle"></i> Add row</button> ' +
                    '<button disabled class="btn btn-danger" id="delete-' + t['id'] + '" data-target="' + t['id'] +
                    '" onclick="javascript:deleteSelectedRow(this);">' +
                    '<i class="bi bi-trash"></i> Delete row</button> ' +
                    '<button disabled class="btn btn-danger" id="undo-' + t['id'] + '" data-target="' + t['id'] +
                    '" onclick="javascript:undoTableEdit(this);">' +
                    '<i class="bi bi-arrow-90deg-left"></i></button> ' +
                    '<button disabled class="btn btn-danger" id="redo-' + t['id'] + '" data-target="' + t['id'] +
                    '" onclick="javascript:redoTableEdit(this);">' +
                    '<i class="bi bi-arrow-90deg-right"></i></button> ' +
                    '<span class="float-end">' +
                    '<button disabled class="btn btn-danger" id="discard-' + t['id'] + '" data-target="' + t['id'] +
                    '" onclick="javascript:discardTableEdit(this);">' +
                    '<i class="bi bi-trash"></i> Discard</button> ' +
                    '<button disabled class="btn btn-success" id="save-' + t['id'] + '" data-target="' + t['id'] +
                    '" onclick="javascript:saveTableEdit(this);">' +
                    '<i class="bi bi-check2-circle"></i> Save</button>' +
                    '</span></div>'
                    : '') +
                '</div>'
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
            generateTable(t, data[t['id']])
        })
    })
    tablesGenerated = true
    window.dispatchEvent(new Event("tablesGenerated"))

    document.querySelector('#loader').remove()
    pingTab(window.tables[0]["tab"])

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
    document.querySelectorAll("#collapse-" + table + " div.row input").forEach(el => {
        if (el.checked !== state) {
            el.checked = state
            toggleColumn(table, el.getAttribute("data-column"))
        }
    })
}

const toggleColumn = (table, key) => {
    console.log("Toggle visibility of column", key, "for table", table, "visible:",)
    window.dataTables[table].toggleColumn(key)
}

const toggleHandle = (el) => {
    let table = el.getAttribute("data-table")
    if (el.getAttribute("data-toggle-type") === "all") {
        toggleAll(table)
    } else {
        toggleColumn(table, el.getAttribute("data-column"))
        setToggleAllState(table)
    }
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
        e.returnValue = "Unsaved changes for table(s):\n"
        window.editedTables.forEach(t => {
            e.returnValue += t + "\n"
        })
    }
})
