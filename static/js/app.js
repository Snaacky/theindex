// progress of async json loading
let columnsReady, tablesReady, tablesGenerated, dataReady, domReady = false
// remember which tab has already been pinged
let alreadyPingedTab = {}
window.editedTables = []
window.online = {}
window.rawData = {}
window.dataTables = {}


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

    const status = await fetch("https://ping.piracy.moe/pings", {
        method: 'post',
        body: JSON.stringify({"urls": urls}),
        headers: new Headers({'content-type': 'application/json'})
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

    status.forEach(s => window.online[s["url"]] = s["status"])

    tables.forEach(t => window.dataTables[t["id"]].redraw(true))
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
fetch('/static/columns.json')
    .then(data => data.json())
    .then(columns => {
        window.columns = columns
        columnsReady = true
        console.log("Columns loaded...")
        generateAllTables()

        generateColumnsDetails()
    })

// generates tables definition
fetch('/static/tables.json')
    .then(data => data.json())
    .then(tables => {
        window.tables = tables
        tablesReady = true
        console.log("Tables loaded...")
        generateAllTables()
    })

// get actual table data
fetch('/static/data.json')
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
            if ((await checkOnlineStatus())["status"] === "up") {
                document.getElementById("online-status").innerHTML = ""
            } else {
                document.getElementById("online-status").innerHTML = "Ping-system is offline"
            }
        }, 5000) // ping every 5s
        // check once at the beginning instead of waiting for the first 5s
        checkOnlineStatus().then(result => {
            if (result["status"] === "up") {
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