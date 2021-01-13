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
        return `<kbd class="label label-${labelType}" style="${style}"> ${data} </kbd>`
    }

    return data
}

const propertyToName = (property) => {
    switch (property) {
        case "siteName":
            return "Name"
        case "siteAddresses":
            return "Address"
        case "hasAds":
            return "Ads"
        case "isAntiAdblock":
            return "Anti-Adblock"
        case "hasSubs":
            return "Subs"
        case "hasDubs":
            return "Dubs"
        case "otherLanguages":
            return "Languages"
        case "hasReleaseSchedule":
            return "Schedule"
        case "hasDirectDownloads":
            return "DL"
        case "hasBatchDownloads":
            return "Batch DL"
        case "isMobileFriendly":
            return "Mobile Friendly"
        case "isEnglish":
            return "English"
        case "malSyncSupport":
            return "MAL-Sync"
        case "hasWatermarks":
            return "Watermark"
        case "hasDisqusSupport":
            return "Disqus"
        case "editorNotes":
            return "Notes"
        case "hasMalSupport":
            return "MAL Support"
        case "hasTachiyomiSupport":
            return "Tachiyomi"
        case "hasAnilistSupport":
            return "Anilist Support"
        case "hasKitsuSupport":
            return "Kitsu Support"
        case "hasSimKLSupport":
            return "SimKL Support"
        case "siteFeatures":
            return "Features"
        case "siteLanguage":
            return "Site Language"
        default:
            return property
    }
}

const propertyToTooltip = (property) => {
    switch (property) {
        case "siteName":
            return "The sites name"
        case "siteAddresses":
            return "The sites address"
        case "hasAds":
            return "Does the site have ads"
        case "isAntiAdblock":
            return "Does the site block adblockers"
        case "hasSubs":
            return "Does the site offer subs"
        case "hasDubs":
            return "Does the site offer dubs"
        case "360p":
            return "Does the site offer 360p streams"
        case "480p":
            return "Does the site offer 480p streams"
        case "720p":
            return "Does the site offer 720p streams"
        case "1080p":
            return "Does the site offer 1080p streams"
        case "otherLanguages":
            return "What language does the site support"
        case "hasReleaseSchedule":
            return "Does the site have a schedule listing"
        case "hasDirectDownloads":
            return "Does the site offer downloads"
        case "hasBatchDownloads":
            return "Does the site offer batch downloads"
        case "isMobileFriendly":
            return "Is the site friendly on mobile"
        case "isEnglish":
            return "Is this site in English"
        case "malSyncSupport":
            return "Does the site have MAL-Sync support"
        case "hasWatermarks":
            return "Does the site have watermarks on streams"
        case "hasDisqusSupport":
            return "Does the site have a Disqus comments section"
        case "editorNotes":
            return "Any additional notes from the index editors"
        case "hasMalSupport":
            return "Does the site have MAL support"
        case "hasTachiyomiSupport":
            return "Does the site have Tachiyomi support"
        case "hasAnilistSupport":
            return "Does this application have Anilist support"
        case "hasKitsuSupport":
            return "Does this application have Kitsu support"
        case "hasSimKLSupport":
            return "Does this application have SimKL support"
        case "siteFeatures":
            return "This extensions features"
        case "siteLanguage":
            return "The main language of the site"
        default:
            return property
    }
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

const getTableOptions = (tab, data) => {
    let columns = []
    window.tables.forEach(tables => {
        if (tables['tab'] === tab) {
            columns = tables['columns']
        }
    })
    columns = columns.map(e => ({
        name: e['key'],
        data: e['key'],
        visible: !e['hidden']
    }))
    return {
        data,
        "columns": columns,
        columnDefs: [
            {
                targets: Array.from({length: columns.length - 1}, (_, i) => i + 1),
                className: "dt-body-center",
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
            '<div class="col">' + propertyToName('otherLanguages') + ':</div>' +
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
            modalBody += '<th>' + propertyToName(key) + '</th>'
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
            '<div class="col">' + propertyToName(key) + '</div>' +
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

// Fetch raw json so we can combine multiple keys/sets
window.rawData = {}
window.onload = () => {
    // generates tables
    fetch('/tables.json')
        .then(data => data.json())
        .then(tables => {
            window.tables = tables
            tables.forEach(table => {
                // create tables
                let tableString = ''
                table['tables'].forEach(t => {
                    tableString += '<div class="card mb-3">' +
                        '<div class="card-header">' + t['title'] + '</div>' +
                        '<div class="card-body p-0"><div class="table-responsive">' +
                        '<table id="' + t['id'] + '" class="dataTable compact w-100">' +
                        '<thead><tr>'
                    table['columns'].forEach(th => {
                        tableString += '<th title="' + propertyToTooltip(th['key']) + '">' + propertyToName(th['key']) + '</th>'
                    })
                    tableString += '</tr></thead>' +
                        '</table>' +
                        '</div></div>' +
                        '</div>'

                })
                document.querySelector('#' + table['tab']).innerHTML = tableString

                // create specific search-filter
                let filter = '<hr><h3>' + table['name'] + '</h3>' +
                    '<div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5" id="filter-' + table['tab'] + '">'
                table['columns'].forEach(th => {
                    filter += '<div class="col">' +
                        '<div class="form-check form-check-inline form-switch">' +
                        '<input class="form-check-input" type="checkbox" id="show-' + table['tab'] + th['key'] +
                        '"' + (th['hidden'] ? '' : ' checked') + ' data-column="' + th['key'] + '" data-tab="' + table['tab'] +
                        '"> <label class="form-check-label" for="show-' + table['tab'] + th['key'] + '">' +
                        propertyToName(th['key']) + '</label>' +
                        '</div></div>'
                })
                filter += '</div>'
                document.querySelector('#specific-filter').innerHTML += filter

            })

            fetch('/data.json')
                .then(data => data.json())
                .then(json => {
                    // clone data to be displayed in #infoModal
                    window.rawData = JSON.parse(JSON.stringify(json))

                    // Remap entries to convert url arrays into comma seperated strings
                    let parsedData = {}
                    Object.keys(json).forEach(key => {
                        parsedData[key] = json[key].map((entry, index) => {
                            entry.siteName = `<a onclick="showInfoModal('${key}', ${index})" id="` +
                                key + index + '" href="javascript:void(0)">' +
                                '<div class="spinner-grow d-inline-block rounded-circle bg-secondary spinner-grow-sm" data-bs-toggle="tooltip" role="status">' +
                                '<span class="visually-hidden">Loading...</span>' +
                                '</div> ' + entry.siteName + '</a>'
                            return entry
                        })
                    })

                    // initialize datatables
                    window.dataTables = {}
                    window.tables.forEach(tab => {
                        tab['tables'].forEach(t => {
                            window.dataTables[t['id']] = $('#' + t['id']).DataTable(getTableOptions(tab['tab'], parsedData[t['id']]))
                        })
                    })

                    // Handles using a single search bar for multiple tables
                    $('#tableSearch').on('keyup click', () => {
                        Object.keys(window.dataTables).forEach(key => {
                            window.dataTables[key].tables().search($(this).val()).draw()
                        })
                    })

                    document.querySelector('#tablesList').style = ""
                    document.querySelector('#loader').remove()


                    Object.keys(parsedData).forEach(key => {
                        parsedData[key].forEach((entry, index) => {
                            // apply yellow color after 10s if not finished
                            let applyWarning = setTimeout(() => {
                                let onlineStatus = document.querySelector('#' + key + index + '>div')
                                onlineStatus.classList.remove("bg-secondary")
                                onlineStatus.classList.add("bg-warning")
                            }, 10000)

                            // actually ping the site
                            checkOnlineStatus(entry['siteAddresses'][0])
                                .then(result => {
                                    clearTimeout(applyWarning)
                                    let onlineStatus = document.querySelector('#' + key + index + '>div')
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

                    // add event-listener for visibility toggle
                    window.tables.forEach(table => {
                        document.querySelectorAll('#filter-' + table['tab'] + ' input')
                            .forEach(el => {
                                el.addEventListener('change', (event) => {
                                    console.log("Toggling visibility of column", el.getAttribute("data-column"), "in", el.getAttribute("data-tab"))
                                    // Get the column API object
                                    let tab = window.tables.filter(t => t['tab'] === el.getAttribute("data-tab"))[0]
                                    tab['tables'].forEach(t => {
                                        let c = window.dataTables[t['id']].column(el.getAttribute("data-column") + ':name')
                                        console.log("Found column", c, "currently", c.visible())
                                        c.visible(!c.visible())
                                    })
                                })
                            })
                    })
                })
        })

    setInterval(async () => {
        if (await checkOnlineStatus()) {
            document.getElementById("online-status").innerHTML = ""
        } else {
            document.getElementById("online-status").innerHTML = "You or we are OFFLINE"
        }
    }, 10000) // ping every 10s
}
