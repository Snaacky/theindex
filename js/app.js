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
            return "Other Languages"
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

const getAnimeTableOptions = (data) => ({
    data,
    columns: [
        {data: 'siteName'},
        {data: 'hasAds'},
        {data: 'isAntiAdblock'},
        {data: 'hasSubs'},
        {data: 'hasDubs'},
        {data: 'otherLanguages'},
        {data: '360p'},
        {data: '480p'},
        {data: '720p'},
        {data: '1080p'},
        {data: 'hasReleaseSchedule'},
        {data: 'hasDirectDownloads'},
        {data: 'hasWatermarks'},
        {data: 'hasDisqusSupport'}
    ],
    columnDefs: [
        {
            targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            className: "dt-body-center",
            render: render
        }
    ],
    dom: '<"top"i>rt<"bottom">p<"clear">',
    bInfo: false,
    paging: false,
    responsive: true,
    fixedHeader: true
})

const getMangaTableOptions = (data) => ({
    data,
    processing: true,
    cache: false,
    columns: [
        {data: 'siteName'},
        {data: 'hasAds'},
        {data: 'isAntiAdblock'},
        {data: 'isEnglish'},
        {data: 'otherLanguages'},
        {data: 'isMobileFriendly'},
        {data: 'malSyncSupport'},
        {data: 'hasTachiyomiSupport'}
    ],
    columnDefs: [
        {
            targets: [1, 2, 3, 4, 5, 6, 7],
            className: "dt-body-center",
            render: render
        }
    ],
    dom: '<"top"i>rt<"bottom">p<"clear">',
    bInfo: false,
    paging: false,
    responsive: true,
    fixedHeader: true
})

const getLightNovelTableOptions = (data) => ({
    data,
    columns: [
        {data: 'siteName'},
        {data: 'hasAds'},
        {data: 'isAntiAdblock'},
        {data: 'isMobileFriendly'}
    ],
    columnDefs: [
        {
            targets: [1, 2, 3],
            className: "dt-body-center",
            render: render
        }
    ],
    dom: '<"top"i>rt<"bottom">p<"clear">',
    bInfo: false,
    paging: false,
    responsive: true,
    fixedHeader: true
})

const getVisualNovelTableOptions = (data) => ({
    data,
    columns: [
        {data: 'siteName'},
        {data: 'hasAds'},
        {data: 'isAntiAdblock'},
        {data: 'siteLanguage'},
        {data: 'hasSubs'},
        {data: 'isMobileFriendly'},
        {data: 'otherLanguages'}
    ],
    columnDefs: [
        {
            targets: [1, 2, 3, 4, 5],
            className: "dt-body-center",
            render: render
        }
    ],
    dom: '<"top"i>rt<"bottom">p<"clear">',
    bInfo: false,
    paging: false,
    responsive: true,
    fixedHeader: true
})

const getApplicationTableOptions = (data) => ({
    data,
    columns: [
        {data: 'siteName'},
        {data: 'hasMalSupport'},
        {data: 'hasAnilistSupport'},
        {data: 'hasKitsuSupport'},
        {data: 'hasSimKLSupport'},
        {data: 'siteFeatures'}
    ],
    columnDefs: [
        {
            targets: [1, 2, 3, 4],
            className: "dt-body-center",
            render: render
        }
    ],
    dom: '<"top"i>rt<"bottom">p<"clear">',
    bInfo: false,
    paging: false,
    responsive: true,
    fixedHeader: true
})

const showInfoModal = (key, index) => {
    const data = window.rawData[key][index]
    console.log("Creating infoModal for ", key, index, data)

    // Modal-Header
    if (data['isMobileFriendly'] && data['isMobileFriendly'] === 'Y') {
        document.querySelector('#infoModalMobile').style = ""
    } else {
        document.querySelector('#infoModalMobile').style = "display: none;"
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



    for (const key in data) {
        if (alreadyShowed.includes(key)) {
            continue
        }
        modalBody += '<div class="row my-2">' +
            '<div class="col">' + propertyToName(key) + '</div>' +
            '<div class="col">' + render(data[key]) + '</div>' +
            '</div>'
    }

     if (data['editorNotes']) {
        if (data['editorNotes'] == "---") data['editorNotes'] = "No information provided.";
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
window.onload = e => {
    fetch('/data.json')
        .then(data => data.json())
        .then(json => {
            // clone data to be displayed in #infoModal
            window.rawData = JSON.parse(JSON.stringify(json))

            // Remap entries to convert url arrays into comma seperated strings
            const parsedData = {}
            Object.keys(json).forEach(key => {
                parsedData[key] = json[key].map((entry, index) => {
                    entry.siteName = `<a onclick="showInfoModal('${key}', ${index})" href="javascript:void(0)">${entry.siteName}</a>`
                    return entry
                })
            })

            // ANIME SITES ------------------------------
            const animeEnglishTable = $('#animeEnglishTable').DataTable(getAnimeTableOptions(parsedData.englishAnimeSites))
            const animeForeignTable = $('#animeForeignTable').DataTable(getAnimeTableOptions(parsedData.foreignAnimeSites))
            const animeDownloadTable = $('#animeDownloadTable').DataTable(getAnimeTableOptions(parsedData.animeDownloadSites))

            // MANGA SITES ------------------------------
            const mangaTable = $('#mangaTable').DataTable(getMangaTableOptions([...parsedData.englishMangaSites, ...parsedData.foreignMangaSites]))
            const scansTable = $('#scansTable').DataTable(getMangaTableOptions([...parsedData.englishMangaScans, ...parsedData.foreignMangaScans]))

            // NOVEL SITES ------------------------------
            const lightNovelTable = $('#lightNovelTable').DataTable(getLightNovelTableOptions(parsedData.lightNovels))
            const visualNovelTable = $('#visualNovelTable').DataTable(getVisualNovelTableOptions(parsedData.visualNovels))

            // APPLICATIONS ------------------------------
            const iosApplicationsTable = $('#iosApplications').DataTable(getApplicationTableOptions(parsedData.iOSApplications))
            const androidApplicationsTable = $('#androidApplications').DataTable(getApplicationTableOptions(parsedData.androidApplications))
            const windowsApplicationsTable = $('#windowsApplications').DataTable(getApplicationTableOptions(parsedData.windowsApplications))
            const mangaApplicationsTable = $('#mangaApplications').DataTable(getApplicationTableOptions(parsedData.mangaApplications))
            const macOSXApplicationsTable = $('#macApplications').DataTable(getApplicationTableOptions(parsedData.macOSApplications))
            const browserExtensionsTable = $('#browserExtensionsTable').DataTable(getApplicationTableOptions(parsedData.browserExtensions))

            // Handles using a single search bar for multiple tables
            $('#tableSearch').on('keyup click', function () {
                animeEnglishTable.tables().search($(this).val()).draw()
                animeForeignTable.tables().search($(this).val()).draw()
                animeDownloadTable.tables().search($(this).val()).draw()
                mangaTable.tables().search($(this).val()).draw()
                scansTable.tables().search($(this).val()).draw()
                lightNovelTable.tables().search($(this).val()).draw()
                visualNovelTable.tables().search($(this).val()).draw()
                iosApplicationsTable.tables().search($(this).val()).draw()
                androidApplicationsTable.tables().search($(this).val()).draw()
                windowsApplicationsTable.tables().search($(this).val()).draw()
                mangaApplicationsTable.tables().search($(this).val()).draw()
                macOSXApplicationsTable.tables().search($(this).val()).draw()
                browserExtensionsTable.tables().search($(this).val()).draw()
            })

            document.querySelector('#tablesList').style = ""
            document.querySelector('#loader').remove()
        })
}
