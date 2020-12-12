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
  fixedHeader: true,
  order: [[0, 'asc']]
})

const getMangaTableOptions = (data) => ({
  data,
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
  fixedHeader: true,
  order: [[0, 'asc']]
})

const getLightNovelTableOptions = (data) => ({
  data,
  cache: false,
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
  fixedHeader: true,
  order: [[0, 'asc']]
})

const getVisualNovelTableOptions = (data) => ({
  data,
  cache: false,
  columns: [
    { data: 'siteName' },
    { data: 'siteAddresses' },
    { data: 'hasAds' },
    { data: 'isAntiAdblock' },
    { data: 'siteLanguage' },
    { data: 'hasSubs' },
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
  fixedHeader: true,
  order: [[0, 'asc']]
})

const getApplicationTableOptions = (data) => ({
  data,
  cache: false,
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
  fixedHeader: true,
  order: [[0, 'asc']]
})

$('document').ready(async () => {
  // Fetch raw json so we can combine multiple keys/sets
  const response = await fetch('/data.json')
  const json = await response.json()

  // ANIME SITES ------------------------------
  const animeEnglishTable = $('#animeEnglishTable').DataTable(getAnimeTableOptions(json.englishAnimeSites))
  const animeForeignTable = $('#animeForeignTable').DataTable(getAnimeTableOptions(json.foreignAnimeSites))
  const animeDownloadTable = $('#animeDownloadTable').DataTable(getAnimeTableOptions(json.animeDownloadSites))

  // Handles using a single search bar for multiple tables
  $('#animeTableSearch').on('keyup click', function () {
    animeEnglishTable.tables().search($(this).val()).draw()
    animeForeignTable.tables().search($(this).val()).draw()
    animeDownloadTable.tables().search($(this).val()).draw()
  })

  // MANGA SITES ------------------------------

  const mangaTable = $('#mangaTable').DataTable(getMangaTableOptions([...json.englishMangaSites, ...json.foreignMangeSites]))
  const scansTable = $('#scansTable').DataTable(getMangaTableOptions([...json.englishMangaScans, ...json.foreignMangaScans]))

  // Handles using a single search bar for multiple tables
  $('#mangaTableSearch').on('keyup click', function () {
    mangaTable.tables().search($(this).val()).draw()
    scansTable.tables().search($(this).val()).draw()
  })

  // NOVEL SITES ------------------------------
  const lightNovelTable = $('#lightNovelTable').DataTable(getLightNovelTableOptions(json.lightNovels))
  const visualNovelTable = $('#visualNovelTable').DataTable(getVisualNovelTableOptions(json.visualNovels))

  // Handles using a single search bar for multiple tables
  $('#novelTableSearch').on('keyup click', function () {
    lightNovelTable.tables().search($(this).val()).draw()
    visualNovelTable.tables().search($(this).val()).draw()
  })

  // APPLICATIONS ------------------------------
  const iosApplicationsTable = $('#iosApplications').DataTable(getApplicationTableOptions(json.iOSApplications))
  const androidApplicationsTable = $('#androidApplications').DataTable(getApplicationTableOptions(json.androidApplications))
  const mangaApplicationsTable = $('#mangaApplications').DataTable(getApplicationTableOptions(json.mangaApplications))
  const macOSXApplicationsTable = $('#macApplications').DataTable(getApplicationTableOptions(json.macOSApplications))
  const browserExtensionsTable = $('#browserExtensionsTable').DataTable(getApplicationTableOptions(json.browserExtensions))

  // Handles using a single search bar for multiple tables
  $('#applicationsTableSearch').on('keyup click', function () {
    iosApplicationsTable.tables().search($(this).val()).draw()
    androidApplicationsTable.tables().search($(this).val()).draw()
    mangaApplicationsTable.tables().search($(this).val()).draw()
    macOSXApplicationsTable.tables().search($(this).val()).draw()
    browserExtensionsTable.tables().search($(this).val()).draw()
  })
})
