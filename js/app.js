window.rawData = {}
// progress of async json loading
let columnsReady, tablesReady, tablesGenerated, dataReady = false

const render = (data) => {
    const styleMap = {
        Y: {
            labelType: 'default',
            style: 'color: #50992a;'
        },
        N: {
            labelType: 'default',
            style: 'color: #a05262;'
        },
        '?': {
            labelType: 'default',
            style: 'color: #9b9b9b;'
        },
        '-': {
            labelType: 'default',
            style: 'color: #9b9b9b;'
        }
    }

    if (!data) {
        data = '?'
    }

    const styles = styleMap[data]

    if (styles) {
        const labelType = styles.labelType || 'default'
        const style = styles.style || ''
        return `<kbd class="label label-${labelType}" style="${style}">${data}</kbd>`
    }

    return data
}

const propertyName = (property) => {
    if (columnsReady) {
        try {
            return window.columns["keys"][property]["name"]
        } catch (e) {
            console.error("Property", property, "has no name", e)
        }
    }
    return "???"
}

const propertyDescription = (property) => {
    if (columnsReady) {
        try {
            return window.columns["keys"][property]["description"]
        } catch (e) {
            console.error("Property", property, "has no description", e)
        }
    }
    return "???"
}

const checkOnlineStatus = async (server) => {
    if (!server) {
        server = ""
    }
    server += "/ping"
    try {
        const online = await fetch(server, {
            method: 'HEAD',
            mode: 'no-cors'
        })
        return online.status < 500 // either true or false
    } catch (err) {
        console.log(server + " is not reachable")
        return false // definitely offline
    }
}

const getTableOptions = (table, data) => {
    let columns = window.columns["types"][table["type"]].map(e => ({
        name: e['key'],
        data: e['key'],
        visible: !e['hidden']
    }))
    return {
        data,
        columns: columns,
        columnDefs: [{
                targets: Array.from({length: columns.length - 1}, (_, i) => i + 1),
                className: "dt-body-center dt-body-nowrap dt-head-nowrap",
                render: render
            }
        ],
        dom: '<"top"i>rt<"bottom">p<"clear">',
        bInfo: false,
        paging: false,
        responsive: true,
        fixedHeader: true
    }
}

const showInfoModal = (key, index) => {
    const data = window.rawData[key][index]
    console.log("Creating infoModal for ", key, index, data)

    // Modal-Header
    if (data['isMobileFriendly'] && data['isMobileFriendly'] === 'Y') {
        document.querySelector('#infoModalMobile>span').style = ""
    } else {
        document.querySelector('#infoModalMobile>span').style = "display: none;"
    }
    document.querySelector('#infoModalLabel').innerHTML = data.siteName

    // Modal-Body
    let alreadyShowed = ['siteName', 'siteAddresses', 'editorNotes', 'siteFeatures', 'hasSubs', 'hasDubs', '360p',
        '480p', '720p', '1080p', 'hasWatermarks', 'hasAds', 'isAntiAdblock', 'otherLanguages', 'hasDirectDownloads',
        'hasBatchDownloads', 'isMobileFriendly', 'malSyncSupport', 'hasDisqusSupport', 'hasTachiyomiSupport',
        'hasAnilistSupport', 'hasKitsuSupport', 'hasSimKLSupport', 'hasMalSupport']
    let modalBody = '<div class="card bg-darker text-white mb-2">' +
        '<div class="card-header">' +
        '<strong class="me-auto">Official Sites</strong>' +
        '</div>' +
        '<div class="card-body">'
    let primary = true
    data['siteAddresses'].forEach(address => {
        modalBody += ' <a class="btn btn-' + (primary ? 'primary' : 'secondary') + ' rounded-pill" target="_blank" href="' + address + '">🔗 ' +
            address + '</a>'
        primary = false
    })
    modalBody += '</div>' +
        '</div>'

    if (data['siteFeatures']) {
        modalBody += '<p class="my-3">' + data['siteFeatures'] + '</p>'
    }

    if ((data['hasAds'] || data['isAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
        modalBody += '<div class="row"><div class="col-sm-6">'
    }
    if (data['hasAds'] || data['isAntiAdblock']) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">Ad Policy</strong>' +
            '</div>' +
            '<div class="card-body"><div class="row">' +
            '<div class="col-auto">Ads: ' + render(data['hasAds']) + '</div>' +
            '<div class="col">Anti-Adblock: ' + render(data['isAntiAdblock']) + '</div> ' +
            '</div></div>' +
            '</div>'
    }
    if ((data['hasAds'] || data['isAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
        modalBody += '</div><div class="col-sm-6">'
    }
    if (data['hasDirectDownloads'] || data['hasBatchDownloads']) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">Download Options</strong>' +
            '</div>' +
            '<div class="card-body"><div class="row">' +
            '<div class="col-auto">Downloads: ' + render(data['hasDirectDownloads']) + '</div>' +
            '<div class="col">Batch Downloads: ' + render(data['hasBatchDownloads']) + '</div> ' +
            '</div></div>' +
            '</div>'
    }
    if ((data['hasAds'] || data['isAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
        modalBody += '</div></div>'
    }

    if (data['360p'] || data['480p'] || data['720p'] || data['1080p']) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">Video Options</strong>' +
            '</div>' +
            '<div class="card-body p-0">' +
            '<div class="table-responsive">' +
            '<table class="table table-dark mb-0">' +
            '<thead><tr>' +
            '<th>Subs</th>' +
            '<th>Dubs</th>' +
            '<th>1080p</th>' +
            '<th>720p</th>' +
            '<th>480p</th>' +
            '<th>360p</th>' +
            '<th>Watermarks</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td>' + render(data['hasSubs']) + '</td>' +
            '<td>' + render(data['hasDubs']) + '</td>' +
            '<td>' + render(data['1080p']) + '</td>' +
            '<td>' + render(data['720p']) + '</td>' +
            '<td>' + render(data['480p']) + '</td>' +
            '<td>' + render(data['360p']) + '</td>' +
            '<td>' + render(data['hasWatermarks']) + '</td>' +
            '</tr></tbody>' +
            '</table></div>' +
            '</div></div>'
    }
    if (data['otherLanguages']) {
        modalBody += '<div class="row my-2">' +
            '<div class="col">' + propertyName('otherLanguages') + ':</div>' +
            '<div class="col">' + data['otherLanguages'] + '</div>' +
            '</div>'
    }

    let listSupport = ['malSyncSupport', 'hasMalSupport', 'hasDisqusSupport', 'hasTachiyomiSupport', 'hasAnilistSupport', 'hasKitsuSupport', 'hasSimKLSupport']
    listSupport = listSupport.filter(key => data[key])
    if (listSupport.length > 0) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">3rd-Party Support</strong>' +
            '</div>' +
            '<div class="card-body p-0">' +
            '<div class="table-responsive">' +
            '<table class="table table-dark mb-0">' +
            '<thead><tr>'
        listSupport.forEach(key => {
            modalBody += '<th>' + propertyName(key) + '</th>'
        })
        modalBody += '</tr></thead>' +
            '<tbody><tr>'
        listSupport.forEach(key => {
            modalBody += '<td>' + render(data[key]) + '</td>'
        })
        modalBody += '</tr></tbody>' +
            '</table></div>' +
            '</div></div>'
    }


    Object.keys(data).forEach(key => {
        if (alreadyShowed.includes(key)) {
            return
        }
        modalBody += '<div class="row my-2">' +
            '<div class="col">' + propertyName(key) + '</div>' +
            '<div class="col">' + render(data[key]) + '</div>' +
            '</div>'
    })

    if (data['editorNotes'] && (!["---", "?"].includes(data['editorNotes']))) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">Editor Notes</strong>' +
            '</div>' +
            '<div class="card-body"><div class="row">' +
            '<p class="my-1">' + data['editorNotes'] + '</p>' +
            '</div></div>' +
            '</div>'
    }
    document.querySelector('#infoModal .modal-body').innerHTML = modalBody

// launch modal
    new bootstrap.Modal(document.getElementById('infoModal')).show()
}

const generateTable = (tab, table) => {
    console.log("Generating table", table, "in", tab)
    if (!window.tables || !window.columns) {
        console.error("Missing data: tables:", window.tables, "columns:", window.columns)
        return
    }

    // create tables
    let tableString = '<div class="card mb-3" id="' + table['id'] + '">' +
        '<div class="card-header">' + table['title'] +
        '<a class="float-end d-flex justify-content-center text-decoration-none text-white" id="toggleFilter-' + table['id'] +
        '" data-bs-toggle="collapse" data-bs-target="#collapse-' + table['id'] + '" aria-expanded="false" ' +
        'aria-controls="search-filter" href="javascript:;"><i class="bi bi-toggles"></i></a></div>' +
        '<div class="card-body p-0"><div class="collapse" id="collapse-' + table['id'] + '">' +
        '<div class="card card-body"><div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5">'

    // add column toggles
    try {
        window.columns['types'][table["type"]].forEach(th => {
            if (th['key'] === "siteName") {
                return
            }
            tableString += '<div class="col">' +
                '<div class="form-check form-check-inline form-switch">' +
                '<input class="form-check-input" type="checkbox" id="show-' + table['id'] + th['key'] +
                '"' + (th['hidden'] ? '' : ' checked') + ' data-column="' + th['key'] + '" data-table="' +
                table['id'] + '"> <label class="form-check-label" for="show-' + table['id'] + th['key'] + '">' +
                propertyName(th['key']) + '</label>' +
                '</div></div>'
        })
    } catch (e) {
        console.error("Table type", table["type"], "could not be found", e)
    }

    tableString += '</div></div></div><div class="table-responsive">' +
        '<table id="table-' + table['id'] + '" class="dataTable compact w-100">' +
        '<thead><tr>'

    // add thead row
    window.columns['types'][table["type"]].forEach(th => {
        tableString += '<th title="' + propertyDescription(th['key']) + '">' + propertyName(th['key']) + '</th>'
    })

    tableString += '</tr></thead>' +
        '</table>' +
        '</div></div>' +
        '</div>'

    document.querySelector('#' + tab).innerHTML += tableString
}

const generateAllTables = () => {
    if (columnsReady && tablesReady) {
        window.tables.forEach(tab => {
            tab['tables'].forEach(t => generateTable(tab["tab"], t))
        })
        tablesGenerated = true
        populateTables()
    }
}

let alreadyPingedTab = {}
const pingTab = (tab) => {
    if (alreadyPingedTab[tab]) {
        return
    }
    alreadyPingedTab[tab] = true

    let tables = window.tables.filter(t => t["tab"] === tab)[0]["tables"]
    console.log("Pinging for tab", tab, tables)
    tables.forEach(table => {
        window.rawData[table["id"]].forEach((entry, index) => {
            // apply yellow color after 10s if not finished
            let applyWarning = setTimeout(() => {
                let onlineStatus = document.querySelector('#online-' + table["id"] + index)
                onlineStatus.classList.remove("bg-secondary")
                onlineStatus.classList.add("bg-warning")
            }, 10000)

            // actually ping the site
            checkOnlineStatus(entry['siteAddresses'][0])
                .then(result => {
                    clearTimeout(applyWarning)
                    let onlineStatus = document.querySelector('#online-' + table["id"] + index)
                    onlineStatus.classList.remove("spinner-grow")
                    // remove previous color-state
                    if (onlineStatus.classList.contains("bg-secondary")) {
                        onlineStatus.classList.remove("bg-secondary")
                    } else {
                        onlineStatus.classList.remove("bg-warning")
                    }

                    // apply result color
                    if (result) {
                        onlineStatus.classList.add("bg-success")
                        onlineStatus.setAttribute("title", "Online")
                    } else {
                        onlineStatus.classList.add("bg-danger")
                        onlineStatus.setAttribute("title", "Offline")
                    }

                    // initialize Tooltip
                    new bootstrap.Tooltip(onlineStatus)
                })
        })
    })
}

const populateTables = () => {
    console.log("Populating tables with data, Status:")
    console.log("tablesGenerated:\t", tablesGenerated, "\tdataReady:\t", dataReady, "\tcolumnsReady:\t", columnsReady, "\ttablesReady:\t", tablesReady)
    if (!tablesGenerated || !dataReady) {
        return
    }

    // clone data to be displayed in #infoModal
    let data = JSON.parse(JSON.stringify(window.rawData))

    // Remap entries to convert url arrays into comma seperated strings
    let parsedData = {}
    Object.keys(data).forEach(key => {
        parsedData[key] = data[key].map((entry, index) => {
            entry.siteName = '<div class="spinner-grow d-inline-block rounded-circle bg-secondary spinner-grow-sm" id="online-' +
                key + index + '" data-bs-toggle="tooltip" role="status">' +
                '<span class="visually-hidden">Loading...</span>' +
                '</div> ' + `<a onclick="showInfoModal('${key}', ${index})" href="javascript:void(0)">` +
                entry.siteName + '</a>'
            return entry
        })
    })

    // initialize datatables
    window.dataTables = {}
    window.tables.forEach(tab => {
        tab['tables'].forEach(t => {
            window.dataTables[t['id']] = $('#table-' + t['id']).DataTable(getTableOptions(t, parsedData[t['id']]))
        })
    })

    document.querySelector('#tablesList').style = ""
    document.querySelector('#loader').remove()
    pingTab(window.tables[0]["tab"])


    // Handles using a single search bar for multiple tables
    $('#tableSearch').on('keyup click', () => {
        Object.keys(window.dataTables).forEach(key => {
            window.dataTables[key].tables().search($(this).val()).draw()
        })
    })

    // collapse of column selection
    window.tables.forEach(tab => {
        tab["tables"].forEach(table => {
            document.querySelectorAll('#collapse-' + table['id'] + ' input')
                .forEach(el => {
                    el.addEventListener('change', (event) => {
                        console.log("Toggling visibility of column", el.getAttribute("data-column"), "for table",
                            el.getAttribute("data-table"), "in tab", el.getAttribute("data-tab"))
                        // Get the column API object
                        let c = window.dataTables[el.getAttribute("data-table")].column(el.getAttribute("data-column") + ':name')
                        console.log("Found column", c, "currently", c.visible())
                        c.visible(!c.visible())
                    })
                })
        })
    })
}

window.onload = () => {
    // get columns definition
    fetch('/columns.json')
        .then(data => data.json())
        .then(columns => {
            window.columns = columns
            columnsReady = true
            console.log("Columns loaded...")
            generateAllTables()
        })
    // generates tables
    fetch('/tables.json')
        .then(data => data.json())
        .then(tables => {
            window.tables = tables
            tablesReady = true
            console.log("Tables loaded...")
            generateAllTables()
        })
    // get data
    fetch('/data.json')
        .then(data => data.json())
        .then(json => {
            window.rawData = json
            dataReady = true
            console.log("Data loaded...")
            populateTables()
        })

    setInterval(async () => {
        if (await checkOnlineStatus()) {
            document.getElementById("online-status").innerHTML = ""
        } else {
            document.getElementById("online-status").innerHTML = "You or we are OFFLINE"
        }
    }, 10000) // ping every 10s


    // switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(el => el.addEventListener('shown.bs.tab', e => {
        console.log("Switching tab", e.target.getAttribute('aria-controls'), e.relatedTarget.getAttribute('aria-controls'))

        // ping if not already pinged
        pingTab(e.target.getAttribute('aria-controls'))
    }))
}
