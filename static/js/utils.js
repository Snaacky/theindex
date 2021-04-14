// strip string of any unsafe css chars
const cssSafe = (inputString) => {
    if (inputString) {
        return inputString.replace(/\W/g, '')
    }
    return ""
}

// RegEx matches the input against the IETF standard for URLs
const validateUrl = (value) =>
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        value
    )

// adds the same function fn for multiple events s to element el
const addListenerMulti = (el, s, fn) => {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

// calculates the needed width of a text using a DOM-Element
const calcTextWidth = (text) => {
    let el = document.querySelector("#text-width-test")
    el.innerHTML = text;

    return Math.ceil(el.clientWidth);
}

// property key to name
const propertyName = (property) => {
    if (columnsReady) {
        try {
            return window.columns.filter((c) => c["key"] === property)[0]["name"]
        } catch (e) {
            console.error("Property", property, "has no name", e)
        }
    }
    return "???"
}

// property key to description
const propertyDescription = (property) => {
    if (columnsReady) {
        try {
            return window.columns.filter((c) => c["key"] === property)[0]["description"]
        } catch (e) {
            console.error("Property", property, "has no description", e)
        }
    }
    return "???"
}

const checkOnlineStatus = async (server) => {
    if (!server) {
        server = "https://piracy.moe"
    }
    if (server.slice(server.length - 1) === "/") {
        server = server.slice(0, -1);
    }


    const status = await fetch("https://ping.piracy.moe/ping", {
        method: 'post',
        body: JSON.stringify({"url": server}),
        headers: new Headers({'content-type': 'application/json'})
    }).then(response => {
        if (!response.ok) {
            console.error("Ping-System response is not ok for", server, response)
        }
        return response.json()
    }).catch(error => {
        // well for other errors like timeout, ssl or connection error...
        console.error("Unable to complete ping-request of ", server, "due to:", error)
        return false
    })

    window.online[status["url"]] = status["status"]
    return status
}

// log to console the async loading status
const loadingLog = () => {
    console.log("tablesGenerated:", tablesGenerated, "columnsReady:", columnsReady, "tablesReady:", tablesReady, "domReady:", domReady)
}

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
    let alreadyShowed = ['siteName', 'siteAddresses', 'editorNotes', 'siteFeatures', 'hasSubs', 'hasDubs',
        'resolution360p', 'resolution480p', 'resolution720p', 'resolution1080p', 'hasWatermarks', 'hasAds',
        'hasAntiAdblock', 'otherLanguages', 'hasDirectDownloads', 'hasBatchDownloads', 'isMobileFriendly',
        'malSyncSupport', 'hasDisqusSupport', 'hasTachiyomiSupport', 'hasAnilistSupport', 'hasKitsuSupport',
        'hasSimKLSupport', 'hasMalSupport']
    let modalBody = '<div class="card bg-darker text-white mb-2">' +
        '<div class="card-header">' +
        '<strong class="me-auto">Official Sites</strong>' +
        '</div>' +
        '<div class="card-body">'

    if (data['siteAddresses']) {
        let primary = true
        let urls = workaroundAddressArray(data['siteAddresses'], "array")
        urls.forEach(address => {
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

    if ((data['hasAds'] || data['hasAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
        modalBody += '<div class="row"><div class="col-sm-6">'
    }
    if (data['hasAds'] || data['hasAntiAdblock']) {
        modalBody += '<div class="card bg-darker text-white my-2">' +
            '<div class="card-header">' +
            '<strong class="me-auto">Ad Policy</strong>' +
            '</div>' +
            '<div class="card-body"><div class="row">' +
            '<div class="col-auto">Ads: ' + render(data['hasAds']) + '</div>' +
            '<div class="col">Anti-Adblock: ' + render(data['hasAntiAdblock']) + '</div> ' +
            '</div></div>' +
            '</div>'
    }
    if ((data['hasAds'] || data['hasAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
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
    if ((data['hasAds'] || data['hasAntiAdblock']) && (data['hasDirectDownloads'] || data['hasBatchDownloads'])) {
        modalBody += '</div></div>'
    }

    if (data['resolution360p'] || data['resolution480p'] || data['resolution720p'] || data['resolution1080p']) {
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
            '<td>' + render(data['resolution1080p']) + '</td>' +
            '<td>' + render(data['resolution720p']) + '</td>' +
            '<td>' + render(data['resolution480p']) + '</td>' +
            '<td>' + render(data['resolution360p']) + '</td>' +
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

    let listSupport = ['malSyncSupport', 'hasMalSupport', 'hasDisqusSupport', 'hasTachiyomiSupport',
        'hasAnilistSupport', 'hasKitsuSupport', 'hasSimKLSupport']
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
        if (alreadyShowed.includes(key) || key === "id") {
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
