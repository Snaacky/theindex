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

    const styles = styleMap[data]

    if (styles) {
        const labelType = styles.labelType || 'default'
        const style = styles.style || ''
        return `<span class="label label-${labelType}" style="background-color: rgba(26, 26, 26, 1); ${style}"> ${data} </span>`
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
        case "malSyncSupport":
            return "MAl-Sync"
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
        {data: 'hasBatchDownloads'},
        {data: 'isMobileFriendly'},
        {data: 'malSyncSupport'},
        {data: 'hasWatermarks'},
        {data: 'hasDisqusSupport'},
        {data: 'editorNotes'},
    ],
    columnDefs: [
        {
            targets: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
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
    document.querySelector('#infoModalLabel').innerHTML = data.siteName

    let modalBody = ""
    if (data.editorNotes) {
        modalBody += '<p class="my-3">' + data.editorNotes + '</p>'
    }
    if (data.siteFeatures) {
        modalBody += '<p class="my-3">' + data.siteFeatures + '</p>'
    }

    modalBody += '<div class="my-3 d-flex">'
    data.siteAddresses.forEach(address => {
        modalBody += '<a class="btn btn-secondary" target="_blank" href="' + address + '">' + address + '</a>'
    })
    modalBody += '</div>'

    for (const key in data) {
        if (['siteName', 'siteAddresses', 'editorNotes', 'siteFeatures'].includes(key)) {
            continue
        }
        modalBody += '<div class="row my-2">' +
            '<div class="col">' + propertyToName(key) + '</div>' +
            '<div class="col">' + render(data[key]) + '</div>' +
            '</div>'
    }

    // launch modal
    document.querySelector('#infoModal .modal-body').innerHTML = modalBody
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
