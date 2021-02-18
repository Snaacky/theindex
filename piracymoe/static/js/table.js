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

    let columnData = [{
        width: 30,
        minWidth: 30,
        hozAlign: "center",
        resizable: false,
        cssClass: "cell-infoModal",
        tooltip: cell => "Info",
        cellClick: (e, cell) => {
            console.log("info-click", e, cell)
            showInfoModal(cell.getRow())
        },
        formatter: cell => '<i class="bi bi-info-circle"></i>'
    }, {
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
            return status + '" id="online-' + cssSafe(data["siteName"]) + '" role="status"></div> ' + cell.getValue()
        },
        cellClick: (e, cell) => {
            let data = cell.getRow().getData()
            window.open(data.siteAddresses[0], '_blank')
            // this may work or may not... it's from browser to browser and from version to version different :/
            window.focus();
        }
    }
    ]

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
            columnData.push({
                title: propertyName(th['key']),
                field: th['key'],
                visible: !th['hidden'],
                hozAlign: "center",
                headerHozAlign: "center",
                formatter: render
            })
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
            data: data
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
                '<div id="table-' + t['id'] + '"></div></div>' +
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

    Object.keys(window.dataTables).forEach(key => {
        window.dataTables[key].redraw(true)
    })

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
        return console.error("Columns aren't ready")
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