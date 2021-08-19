// progress of async json loading
let columnsReady, tablesReady, tablesGenerated, domReady = false
// remember which tab has already been pinged
let alreadyPinged = {}
window.editedTables = []
window.online = {}
window.rawData = {}
window.dataTables = {}


// ping all sites listed on a tab
const pingTable = async (table) => {
    if (!tablesGenerated || alreadyPinged[table]) {
        return
    }

    alreadyPinged[table] = true

    console.log("Pinging for table", table)
    const urls = window.rawData[table].map(e => {
        if (e) {
            let urls = workaroundAddressArray(e["siteAddresses"], "array")
            window.online[urls[0]] = "pinging"
            return urls[0]
        }
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

    if (status) {
        status.forEach(s => window.online[s["url"]] = s["status"])
        window.dataTables[table].redraw(true)
    }
}

// --- load a bunch of json ---
window.editMode = false
fetch('/user/is-login')
    .then(data => data.json())
    .then(is_login => {
        console.log("You are logged in:", is_login["edit"])
        document.querySelectorAll(".user-only").forEach(node => {
            if (node.style.display === "none") {
                if (is_login["edit"]) {
                    node.style.display = null
                }
            } else if (!is_login["edit"]) {
                node.style.display = "none"
            }
        })
    })

// generates tables definition
fetch('/api/fetch/tables')
    .then(data => data.json())
    .then(tables => {
        window.tables = tables
        tablesReady = true
        console.log("Tables loaded...")
        generateAllTables()
    })

// get columns definition
fetch('/api/fetch/columns')
    .then(data => data.json())
    .then(columns => {
        window.columns = columns
        columnsReady = true
        console.log("Columns loaded...")
        generateAllTables()

        generateColumnsDetails()
    })


// here happens the magic
window.addEventListener('load', () => {
    domReady = true

    // if data already loaded, but could not execute as DOM wasn't ready yet
    generateAllTables()
    generateColumnsDetails()

    setInterval(async () => {
        if ((await checkOnlineStatus())["status"] === "down") {
            document.getElementById("online-status").innerHTML = "Ping-system is offline"
        } else {
            document.getElementById("online-status").innerHTML = ""
        }
    }, 5000) // ping every 5s
    // check once at the beginning instead of waiting for the first 5s
    checkOnlineStatus().then(result => {
        if (result["status"] === "down") {
            document.getElementById("online-status").innerHTML = "Ping-system is offline"
        } else {
            document.getElementById("online-status").innerHTML = ""
        }
    })


    // switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(async el => el.addEventListener('shown.bs.tab', e => {
        let tab = e.target.getAttribute('aria-controls')
        console.log("Switching tab", e.relatedTarget.getAttribute('aria-controls'), "->", tab)
        Object.keys(window.dataTables).forEach(key => {
            window.dataTables[key].redraw(true)
        })
    }))

    // Handles using a single search bar for multiple tables
    addListenerMulti(document.querySelector("#tableSearch"), "keyup click", () => {
        const search = document.querySelector('#tableSearch').value
        Object.keys(window.dataTables).forEach(key => {
            window.dataTables[key].setFilter("siteName", "like", search)
        })
    })
})
