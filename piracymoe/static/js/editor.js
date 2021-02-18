const siteSelectorDiv = document.getElementById('siteSelector')
const dataSetSelector = document.getElementById('dataSelector')

let json

const selectionEmojis = ['✔️', '❌', '❔']

const elements = () => {
    return {
        siteName: document.getElementById('Name'),
        siteAddresses: document.getElementById('Address'),
        '360p': document.getElementById('360p'),
        '480p': document.getElementById('480p'),
        '720p': document.getElementById('720p'),
        '1080p': document.getElementById('1080p'),
        hasDubs: document.getElementById('Dubs'),
        hasSubs: document.getElementById('Subs'),
        hasAds: document.getElementById('Ads'),
        isAntiAdblock: document.getElementById('Anti-Adblock'),
        isMobileFriendly: document.getElementById('Mobile-Friendly'),
        malSyncSupport: document.getElementById('MAL-Sync'),
        hasWatermarks: document.getElementById('Watermark'),
        hasDisqusSupport: document.getElementById('Disqus'),
        hasReleaseSchedule: document.getElementById('Schedule'),
        hasDirectDownloads: document.getElementById('DL'),
        hasBatchDownloads: document.getElementById('BatchDL'),
        editorNotes: document.getElementById('Notes'),
        isEnglish: document.getElementById('isEnglish'),
        otherLanguages: document.getElementById('otherLanguages'),
        hasTachiyomiSupport: document.getElementById('hasTachiyomiSupport'),
        hasMalSupport: document.getElementById('hasMalSupport'),
        hasAnilistSupport: document.getElementById('hasAnilistSupport'),
        hasKitsuSupport: document.getElementById('hasKitsuSupport'),
        hasSimKLSupport: document.getElementById('hasSimKLSupport'),
        siteFeatures: document.getElementById('siteFeatures'),
        siteLanguage: document.getElementById('siteLanguage')
    }
}

const convertEmojiToChar = (emoji) => {
    switch (emoji) {
        case '✔️':
            return 'Y'
        case '❌':
            return 'N'
        case '❔':
            return '?'
        default:
            return char
    }
}

const convertCharToEmoji = (char) => {
    if (!char) return '❔'
    switch (char.toLowerCase()) {
        case 'y':
            return '✔️'
        case 'n':
            return '❌'
        case '-':
        case '?':
            return '❔'
        default:
            return char
    }
}

const injectEditor = (editorName) => {
    // Prepends the appropriate editor HTML based on the editorName passed
    const animeEditor =
        '<form id="animeEditor"><h5 class="card-title">Main Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-4"> <label for="Name">Name</label> <input type="text" class="form-control" id="Name" /></div><div class="form-group col-md-4"> <label for="Address">Address</label><textarea class="form-control rounded-30" id="Address" rows="2"></textarea></div></div><h5 class="card-title">Qualities</h5><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="360p">360p</label> <select id="360p" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="480p">480p</label> <select id="480p" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="720p">720p</label> <select id="720p" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="1080p">1080p</label> <select id="1080p" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Languages</h5><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="Dubs">Dubs</label> <select id="Dubs" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="Subs">Subs</label> <select id="Subs" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="otherLanguages">Other Languages</label> <input type="text" class="form-control" id="otherLanguages" /></div></div><h5 class="card-title">Ad Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="Ads">Ads</label> <select id="Ads" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="Anti-Adblock">Anti-Adblock</label> <select id="Anti-Adblock" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Misc</h5><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="Mobile Friendly">Mobile Friendly</label> <select id="Mobile-Friendly" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="MAL-Sync">MAL-Sync</label> <select id="MAL-Sync" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="Watermark">Watermark</label> <select id="Watermark" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="Disqus">Disqus</label> <select id="Disqus" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="Schedule">Schedule</label> <select id="Schedule" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="DL">DL</label> <select id="DL" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="BatchDL">Batch DL</label> <select id="BatchDL" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><div class="row flex justify-content-center"><div class="form-group col-md-12"> <label for="Notes">Site Notes</label><textarea class="form-control rounded-30" id="Notes" rows="5"></textarea></div></div> <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#confirmSaveModal">Save Changes</button><button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#confirmDeleteModal">Delete Entry</button></form>'

    const mangaEditor =
        '<form id="mangaEditor"><h5 class="card-title">Main Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-4"> <label for="Name">Name</label> <input type="text" class="form-control" id="Name" /></div><div class="form-group col-md-4"> <label for="Address">Address</label><textarea class="form-control rounded-30" id="Address" rows="2"></textarea></div></div><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="isEnglish">English</label> <select id="isEnglish" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="otherLanguages">Other Languages</label> <input type="text" class="form-control" id="otherLanguages" /></div></div><h5 class="card-title">Ad Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="Ads">Ads</label> <select id="Ads" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="Anti-Adblock">Anti-Adblock</label> <select id="Anti-Adblock" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Misc</h5><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="Mobile Friendly">Mobile Friendly</label> <select id="Mobile-Friendly" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="MAL-Sync">MAL-Sync</label> <select id="MAL-Sync" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="hasTachiyomiSupport">Tachiyomi</label> <select id="hasTachiyomiSupport" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><div class="row flex justify-content-center"><div class="form-group col-md-12"> <label for="Notes">Site Notes</label><textarea class="form-control rounded-30" id="Notes" rows="5"></textarea></div></div> <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#confirmSaveModal">Save Changes</button><button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#confirmDeleteModal">Delete Entry</button></form>'

    const visualNovelEditor =
        '<form id="visualNovelEditor"><h5 class="card-title">Main Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-4"> <label for="Name">Name</label> <input type="text" class="form-control" id="Name" /></div><div class="form-group col-md-4"> <label for="Address">Address</label><textarea class="form-control rounded-30" id="Address" rows="2"></textarea></div></div><h5 class="card-title">Ad Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="Ads">Ads</label> <select id="Ads" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="Anti-Adblock">Anti-Adblock</label> <select id="Anti-Adblock" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Misc</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="siteLanguage">Language</label> <input type="text" class="form-control" id="siteLanguage" /></div><div class="form-group col-md-2"> <label for="Subs">Subs</label> <select id="Subs" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-2"> <label for="Mobile Friendly">Mobile Friendly</label> <select id="Mobile-Friendly" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="otherLanguages">Other Languages</label> <input type="text" class="form-control" id="otherLanguages" /></div></div> <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#confirmSaveModal">Save Changes</button><button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#confirmDeleteModal">Delete Entry</button></form>'

    const lightNovelEditor =
        '<form id="lightNovelEditor"><h5 class="card-title">Main Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-4"> <label for="Name">Name</label> <input type="text" class="form-control" id="Name" /></div><div class="form-group col-md-4"> <label for="Address">Address</label><textarea class="form-control rounded-30" id="Address" rows="2"></textarea></div></div><h5 class="card-title">Ad Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="Ads">Ads</label> <select id="Ads" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="Anti-Adblock">Anti-Adblock</label> <select id="Anti-Adblock" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Misc</h5><div class="row flex justify-content-center"><div class="form-group col-md-2"> <label for="Mobile Friendly">Mobile Friendly</label> <select id="Mobile-Friendly" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div> <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#confirmSaveModal">Save Changes</button><button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#confirmDeleteModal">Delete Entry</button></form>'

    const applicationsEditor =
        '<form id="applicationsEditor"><h5 class="card-title">Main Information</h5><div class="row flex justify-content-center"><div class="form-group col-md-4"> <label for="Name">Name</label> <input type="text" class="form-control" id="Name" /></div><div class="form-group col-md-4"> <label for="Address">Address</label><textarea class="form-control rounded-30" id="Address" rows="2"></textarea></div></div><h5 class="card-title">Supports</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="hasMalSupport">MAL Support</label> <select id="hasMalSupport" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="hasAnilistSupport">Anilist Support</label> <select id="hasAnilistSupport" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="hasKitsuSupport">Kitsu Support</label> <select id="hasKitsuSupport" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div><div class="form-group col-md-3"> <label for="hasSimKLSupport">SimKL Support</label> <select id="hasSimKLSupport" class="form-control"><option>✔️</option><option>❌</option><option selected>❔</option> </select></div></div><h5 class="card-title">Misc</h5><div class="row flex justify-content-center"><div class="form-group col-md-3"> <label for="siteFeatures">Site Features</label> <input type="text" class="form-control" id="siteFeatures" /></div></div><div class="row flex justify-content-center"> <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#confirmSaveModal">Save Changes</button></div><button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#confirmDeleteModal">Delete Entry</button></form>'

    const extensionsEditor = applicationsEditor // Both use the same editor HTML, don't need another big string

    // LOL, this shit is just sad, bro
    $('#editorParent').prepend(eval(editorName))
}

// Updates the sites dropdown with the sites from the dataset
const handleDataChange = (event) => {
    const d = document.getElementById('dataSelector').value
    // Reset the currently selected editor
    $('[id$=Editor]').remove()

    // Get the value of the current selected data set
    const val = $('#dataSelector').val().toLowerCase()

    // Inject the appropriate editor
    if (val.includes('anime')) injectEditor('animeEditor')
    else if (val.includes('manga')) injectEditor('mangaEditor')
    else if (val.includes('lightnovel')) injectEditor('lightNovelEditor')
    else if (val.includes('visualnovel')) injectEditor('visualNovelEditor')
    else if (val.includes('application')) injectEditor('applicationsEditor')
    else if (val.includes('extensions')) injectEditor('extensionsEditor')

    // Empty the entry selector and populate with entries from newly selected data set
    $('#siteSelector').empty()
    siteSelectorDiv.innerHTML += '<option selected="" disabled>New entry</option>'
    siteSelectorDiv.innerHTML += json[d].map((site) => `<option>${site.siteName}</option>`).join('')
}

// Populates the editor fields with the data on selection
const handleSelectorChange = (event) => {
    // Get the currently selected Data Set from the dropdown
    const d = document.getElementById('dataSelector').value
    // Find the index of the site data in the array
    const selectedData = json[d].find((item) => item.siteName.trim() === siteSelectorDiv.value.trim())
    // Convert item's keys into an iterable array
    const dataKeys = Object.keys(selectedData)

    // For each key of the site entries dataset
    // Determine which elements are currently in view and obtain their value
    for (const key of dataKeys) {
        // Get current value of the key we are on
        // EX: {"siteAddresses": "anichiraku.ru"}
        let value = selectedData[key]
        if (key === 'siteAddresses') {
            value = value.join(', ')
        }

        // Try to convert the element to it's emoji form if applicable
        try {
            elements()[key].value = convertCharToEmoji(value)
        } catch (err) {
            console.log(`FAILED TO SET: key: ${key} value: ${value} error: ${err}`)
        }
    }
}


// Save changes listener and handler
const handleSubmit = async () => {
    const elementKeys = Object.keys(elements())

    // Error if the site name field is empty for some reason
    if (!elements().siteName.value) {
        return window.alert('If creating a new entry. Name and Address must be filled out!')
    }

    // Validates that all URLs in the addresses field are valid URLs.
    // TODO: This will break on json values that use , instead of \n
    let urls = elements().siteAddresses.value.trim().split(',')

    if (urls.length) {
        urls = urls.map((url) => url.trim()).filter((url) => url)
    }

    for (const url of urls) {
        if (!validateUrl(url)) {
            return window.alert(`${url} is not a valid url.`)
        }
    }

    // Converts any emojis to Y, ?, or N.
    const newEntry = {}
    for (const key of elementKeys) {
        if (!elements()[key]) {
            continue
        }

        if (key === 'siteAddresses') {
            newEntry[key] = urls
            continue
        }

        const newValue = elements()[key].value

        if (selectionEmojis.includes(newValue)) {
            const converted = convertEmojiToChar(newValue)
            newEntry[key] = converted
        } else {
            newEntry[key] = newValue
        }
    }

    // POSTs the data set, site name, and JSON data to the backend.
    await fetch('/admin/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            dataSet: document.getElementById('dataSelector').value,
            entryKey: elements().siteName.value,
            newEntry
        })
    })
    window.alert('Entry Updated')
}

// Delete entry listener and handler
const handleDelete = async () => {
    // Error if the site name field is empty for some reason
    if (!elements().siteName.value) {
        return window.alert('You can only delete existing entries')
    }

    // POSTs the data set, site name, and JSON data to the backend.
    await fetch('/admin/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            dataSet: document.getElementById('dataSelector').value,
            entryKey: elements().siteName.value
        })
    })
    window.alert('Entry deleted')
}

window.addEventListener('tablesGenerated', () => {

})