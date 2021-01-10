const getAnimeTableOptions = (data) => ({
  data,
  columns: [
    { data: 'siteName' },
    { data: 'siteAddresses' },
    { data: 'hasAds' },
    { data: 'isAntiAdblock' },
    { data: 'hasSubs' },
    { data: 'hasDubs' },
    { data: 'otherLanguages' },
    { data: '360p' },
    { data: '480p' },
    { data: '720p' },
    { data: '1080p' },
    { data: 'hasReleaseSchedule' },
    { data: 'hasDirectDownloads' },
    { data: 'hasBatchDownloads' },
    { data: 'isMobileFriendly' },
    { data: 'malSyncSupport' },
    { data: 'hasWatermarks' },
    { data: 'hasDisqusSupport' },
    { data: 'editorNotes' }
  ],
  columnDefs: [
    {
      targets: [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      render: function (data) {
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
    { data: 'siteName' },
    { data: 'siteAddresses' },
    { data: 'hasAds' },
    { data: 'isAntiAdblock' },
    { data: 'isEnglish' },
    { data: 'otherLanguages' },
    { data: 'isMobileFriendly' },
    { data: 'malSyncSupport' },
    { data: 'hasTachiyomiSupport' }
  ],
  columnDefs: [
    {
      targets: [2, 3, 4, 5, 6, 7, 8],
      render: function (data) {
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
  columns: [{ data: 'siteName' }, { data: 'siteAddresses' }, { data: 'hasAds' }, { data: 'isAntiAdblock' }, { data: 'isMobileFriendly' }],
  columnDefs: [
    {
      targets: [2, 3, 4],
      render: function (data) {
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
    { data: 'siteName' },
    { data: 'siteAddresses' },
    { data: 'hasAds' },
    { data: 'isAntiAdblock' },
    { data: 'siteLanguage' },
    { data: 'hasSubs' },
    { data: 'isMobileFriendly' },
    { data: 'otherLanguages' }
  ],
  columnDefs: [
    {
      targets: [2, 3, 4, 5, 6],
      render: function (data) {
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
    { data: 'siteName' },
    { data: 'siteAddresses' },
    { data: 'hasMalSupport' },
    { data: 'hasAnilistSupport' },
    { data: 'hasKitsuSupport' },
    { data: 'hasSimKLSupport' },
    { data: 'siteFeatures' }
  ],
  columnDefs: [
    {
      targets: [2, 3, 4, 5],
      render: function (data) {
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
    }
  ],
  dom: '<"top"i>rt<"bottom">p<"clear">',
  bInfo: false,
  paging: false,
  responsive: true,
  fixedHeader: true
})

// Fetch raw json so we can combine multiple keys/sets
window.onload = e => {
	fetch('/data.json')
	  .then((data) => data.json())
	  .then((json) => {
	    // Remap entries to convert url arrays into comma seperated strings
	    const parsedData = {}
	    Object.keys(json).forEach((key) => {
	      const dataSet = json[key]

	      const entries = dataSet.map((entry) => {
	        entry.siteAddresses = entry.siteAddresses.map(e => '<a href="' + e + '">' + e + '</a>').join(', ')
	        return entry
	      })

	      parsedData[key] = entries
	    })

	    // MANGA SITES ------------------------------
	    const mangaTable = $('#mangaTable').DataTable(getMangaTableOptions([...parsedData.englishMangaSites, ...parsedData.foreignMangaSites]))
	    const scansTable = $('#scansTable').DataTable(getMangaTableOptions([...parsedData.englishMangaScans, ...parsedData.foreignMangaScans]))
	    // Handles using a single search bar for multiple tables
	    $('#mangaTableSearch').on('keyup click', function () {
	      mangaTable.tables().search($(this).val()).draw()
	      scansTable.tables().search($(this).val()).draw()
	    })

	    // ANIME SITES ------------------------------
	    const animeEnglishTable = $('#animeEnglishTable').DataTable(getAnimeTableOptions(parsedData.englishAnimeSites))
	    const animeForeignTable = $('#animeForeignTable').DataTable(getAnimeTableOptions(parsedData.foreignAnimeSites))
	    const animeDownloadTable = $('#animeDownloadTable').DataTable(getAnimeTableOptions(parsedData.animeDownloadSites))
	    // Handles using a single search bar for multiple tables
	    $('#animeTableSearch').on('keyup click', function () {
	      animeEnglishTable.tables().search($(this).val()).draw()
	      animeForeignTable.tables().search($(this).val()).draw()
	      animeDownloadTable.tables().search($(this).val()).draw()
	    })

	    // NOVEL SITES ------------------------------
	    const lightNovelTable = $('#lightNovelTable').DataTable(getLightNovelTableOptions(parsedData.lightNovels))
	    const visualNovelTable = $('#visualNovelTable').DataTable(getVisualNovelTableOptions(parsedData.visualNovels))
	    // Handles using a single search bar for multiple tables
	    $('#novelTableSearch').on('keyup click', function () {
	      lightNovelTable.tables().search($(this).val()).draw()
	      visualNovelTable.tables().search($(this).val()).draw()
	    })
	    // APPLICATIONS ------------------------------
	    const iosApplicationsTable = $('#iosApplications').DataTable(getApplicationTableOptions(parsedData.iOSApplications))
	    const androidApplicationsTable = $('#androidApplications').DataTable(getApplicationTableOptions(parsedData.androidApplications))
	    const windowsApplicationsTable = $('#windowsApplications').DataTable(getApplicationTableOptions(parsedData.windowsApplications))
	    const mangaApplicationsTable = $('#mangaApplications').DataTable(getApplicationTableOptions(parsedData.mangaApplications))
	    const macOSXApplicationsTable = $('#macApplications').DataTable(getApplicationTableOptions(parsedData.macOSApplications))
	    const browserExtensionsTable = $('#browserExtensionsTable').DataTable(getApplicationTableOptions(parsedData.browserExtensions))
	    // Handles using a single search bar for multiple tables
	    $('#applicationsTableSearch').on('keyup click', function () {
	      iosApplicationsTable.tables().search($(this).val()).draw()
	      androidApplicationsTable.tables().search($(this).val()).draw()
	      mangaApplicationsTable.tables().search($(this).val()).draw()
	      macOSXApplicationsTable.tables().search($(this).val()).draw()
	      browserExtensionsTable.tables().search($(this).val()).draw()
	    })
	  })
}
