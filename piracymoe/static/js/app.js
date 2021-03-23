// progress of async json loading
let columnsReady, tablesReady, tablesGenerated, dataReady, domReady = false
// remember which tab has already been pinged
let alreadyPingedTab = {}
window.editedTables = []
window.online = {}
window.rawData = {}
window.dataTables = {}

// displays an info modal of a table row
const showInfoModal = (row) => {
    const data = row.getData()
    console.log("Creating infoModal for ", data)
    //const data = window.rawData[key][index]

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

    if (data['siteAddresses']) {
        let primary = true
        data['siteAddresses'].forEach(address => {
            modalBody += ' <a class="btn btn-' + (primary ? 'primary' : 'secondary') + ' link-light rounded-pill" target="_blank" href="' +
                address + '" rel="noopener">' + (primary ? '<i class="bi bi-box-arrow-up-right"></i> ' : '') +
                address + '</a>'
            primary = false
        })
    }

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

// ping all sites listed on a tab
const pingTab = async (tab) => {
    if (alreadyPingedTab[tab]) {
        return
    }
    alreadyPingedTab[tab] = true

    // filter tables of tab
    const tables = window.tables.filter(t => t["tab"] === tab)[0]["tables"]
    console.log("Pinging for tab", tab, tables)

    // reduce tables to
    let entries = tables.reduce((accumulator, table) => accumulator.concat(window.rawData[table["id"]]), [])
    const urls = entries.map(e => {
        window.online[e["siteAddresses"][0]] = "pinging"
        return e["siteAddresses"][0]
    })

    const status = await fetch("https://ping.piracy.moe/ping", {
        method: 'post',
        body: JSON.stringify({"urls": urls}),
    }).then(response => {
        if (!response.ok) {
            console.error("Ping-System response is not ok for", urls, response)
        }
        return response.json()
    }).catch(error => {
        // well for other errors like timeout, ssl or connection error...
        console.error("Unable to complete ping-request of ", urls, "due to:", error)
        return false
    })

    status.forEach(s => {
        if (s["status"] === "cloudflare") {
            window.online[s["url"]] = "unknown"
        } else if (s["status"] === "online") {
            window.online[s["url"]] = "online"
        } else if (s["status"] === "down") {
            window.online[s["url"]] = "offline"
        } else {
            console.error("impossible status", s)
        }
    })

    tables.forEach(t => {
        window.dataTables[t["id"]].redraw(true)
    })
}

// change i-am-an-adult setting
const adultConsent = (yes) => {
    let remember = document.querySelector("input#remember-i-am-an-adult").checked
    console.log("I am an adult changed to:", yes, "remembering:", remember)
    if (yes === "save") {
        yes = !document.querySelector("#setting-adult-no").classList.contains("btn-success")
    }

    if (remember) {
        localStorage.setItem("i-am-an-adult", yes.toString())
    } else if (localStorage.getItem("i-am-an-adult")) {
        localStorage.removeItem("i-am-an-adult")
    }

    document.querySelectorAll(".i-am-a-adult").forEach(el => {
        if (yes) {
            if (el.classList.contains("d-none")) {
                el.classList.remove("d-none")
            }
        } else {
            if (!el.classList.contains("d-none")) {
                el.classList.add("d-none")
            }
        }
    })

    let y = document.querySelector("#setting-adult-yes").classList,
        n = document.querySelector("#setting-adult-no").classList;
    if (yes) {
        if (y.contains("btn-outline-danger")) {
            y.remove("btn-outline-danger")
            y.add("btn-danger")
        }
        if (n.contains("btn-success")) {
            n.remove("btn-success")
            n.add("btn-outline-success")
        }
    } else {
        if (y.contains("btn-danger")) {
            y.remove("btn-danger")
            y.add("btn-outline-danger")
        }
        if (n.contains("btn-outline-success")) {
            n.remove("btn-outline-success")
            n.add("btn-success")
        }
    }
}

// --- load a bunch of json ---

// TODO: once moved from github-pages, rename /piracymoe/static/... to /static/...
// get columns definition
fetch('/piracymoe/static/columns.json')
    .then(data => data.json())
    .then(columns => {
        window.columns = columns
        columnsReady = true
        console.log("Columns loaded...")
        generateAllTables()

        generateColumnsDetails()
    })

// generates tables definition
fetch('/piracymoe/static/tables.json')
    .then(data => data.json())
    .then(tables => {
        window.tables = tables
        tablesReady = true
        console.log("Tables loaded...")
        generateAllTables()
    })

// get actual table data
fetch('/piracymoe/static/data.json')
    .then(data => data.json())
    .then(json => {
        // TODO: create an array editor for siteAddresses...
        // this is a workaround atm
        if (editMode) {
            Object.keys(json).forEach(key => {
                json[key].forEach(r => r["siteAddresses"] = workaroundAddressArray(r["siteAddresses"], "string"))
            })
        }


        window.rawData = json
        dataReady = true
        console.log("Data loaded...")
        generateAllTables()
    })

// here happens the magic
window.addEventListener('load', () => {
    domReady = true

    // choice will not exists in editor
    if (document.querySelector("#i-am-an-adult-alert")) {
        if (!localStorage.getItem("i-am-an-adult")) {
            document.querySelector("#i-am-an-adult-alert").classList.remove("d-none")
        } else {
            adultConsent(localStorage.getItem("i-am-an-adult") === "true")
        }
    }

    // if data already loaded, but could not execute as DOM wasn't ready yet
    generateAllTables()
    generateColumnsDetails()

    if (!editMode) {
        setInterval(async () => {
            if (await checkOnlineStatus()) {
                document.getElementById("online-status").innerHTML = ""
            } else {
                document.getElementById("online-status").innerHTML = "Ping-system is offline"
            }
        }, 5000) // ping every 5s
        // check once at the beginning instead of waiting for the first 5s
        checkOnlineStatus().then(result => {
            if (result) {
                document.getElementById("online-status").innerHTML = ""
            } else {
                document.getElementById("online-status").innerHTML = "Ping-system is offline"
            }
        })
    }


    // switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(async el => el.addEventListener('shown.bs.tab', e => {
        let tab = e.target.getAttribute('aria-controls')
        console.log("Switching tab", e.relatedTarget.getAttribute('aria-controls'), "->", tab)
        Object.keys(window.dataTables).forEach(key => {
            window.dataTables[key].redraw(true)
        })

        if (tab !== "help" && !editMode) {
            // ping if not already pinged
            pingTab(tab)
        } else {
            return true
        }
    }))

    // Handles using a single search bar for multiple tables
    addListenerMulti(document.querySelector("#tableSearch"), "keyup click", () => {
        const search = document.querySelector('#tableSearch').value
        Object.keys(window.dataTables).forEach(key => {
            window.dataTables[key].setFilter("siteName", "like", search)
        })
    })
})