import json
import os

import dataset


def get_db():
    return "".join(["sqlite:///", os.path.join("/config", "data.db")])


anime_type = [
    "englishAnimeSites",
    "foreignAnimeSites",
    "hentaiAnimeSites"
]
download_type = [
    "downloadSites",
    "hentaiDownloadSites"
]
manga_type = [
    "englishMangaAggregators",
    "englishMangaScans",
    "foreignMangaAggregators",
    "foreignMangaScans",
    "hentaiDoujinshiSites"
]
novel_type = [
    "lightNovels",
    "visualNovels"
]
app_type = [
    "iosApplications",
    "androidApplications",
    "windowsApplications",
    "macOSApplications",
    "browserExtensions",
    "hentaiApplications"
]


def get_language(entry):
    lang = ""
    if "isEnglish" in entry:
        if entry["isEnglish"]:
            lang = "EN"
            if "otherLanguages" in entry or "siteLanguage" in entry:
                lang += ", "
    if "otherLanguages" in entry:
        return lang + entry["otherLanguages"]
    if "siteLanguage" in entry:
        return lang + entry["siteLanguage"]
    return lang


def insert_db(table, entry):
    insert_data = dict(
        siteName=entry["siteName"],
        siteAddresses=json.dumps(entry["siteAddresses"]),
        isMobileFriendly=(entry["isMobileFriendly"] if "isMobileFriendly" in entry else ""),
        features=(entry["siteFeatures"] if "siteFeatures" in entry else ""),
        editorNotes=(entry["editorNotes"] if "editorNotes" in entry else "")
    )
    if table in anime_type:
        insert_data = insert_data | dict(
            hasAds=(entry["hasAds"] if "hasAds" in entry else ""),
            hasAntiAdblock=(entry["isAntiAdblock"] if "isAntiAdblock" in entry else ""),
            resolution360p=(entry["360p"] if "360p" in entry else ""),
            resolution480p=(entry["480p"] if "480p" in entry else ""),
            resolution720p=(entry["720p"] if "720p" in entry else ""),
            resolution1080p=(entry["1080p"] if "1080p" in entry else ""),
            languages=get_language(entry),
            hasSubs=(entry["hasSubs"] if "hasSubs" in entry else ""),
            hasDubs=(entry["hasDubs"] if "hasDubs" in entry else ""),
            hasWatermarks=(entry["hasWatermarks"] if "hasWatermarks" in entry else ""),
            malSyncSupport=(entry["malSyncSupport"] if "malSyncSupport" in entry else ""),
            hasDisqusSupport=(entry["hasDisqusSupport"] if "hasDisqusSupport" in entry else ""),
            hasReleaseSchedule=(entry["hasReleaseSchedule"] if "hasReleaseSchedule" in entry else ""),
            hasDirectDownloads=(entry["hasDirectDownloads"] if "hasDirectDownloads" in entry else ""),
            hasBatchDownloads=(entry["hasBatchDownloads"] if "hasBatchDownloads" in entry else "")
        )
    elif table in download_type:
        insert_data = insert_data | dict(
            hasAds=(entry["hasAds"] if "hasAds" in entry else ""),
            hasAntiAdblock=(entry["isAntiAdblock"] if "isAntiAdblock" in entry else ""),
            resolution360p=(entry["360p"] if "360p" in entry else ""),
            resolution480p=(entry["480p"] if "480p" in entry else ""),
            resolution720p=(entry["720p"] if "720p" in entry else ""),
            resolution1080p=(entry["1080p"] if "1080p" in entry else ""),
            languages=get_language(entry),
            hasSubs=(entry["hasSubs"] if "hasSubs" in entry else ""),
            hasDubs=(entry["hasDubs"] if "hasDubs" in entry else ""),
            hasWatermarks=(entry["hasWatermarks"] if "hasWatermarks" in entry else ""),
            malSyncSupport=(entry["malSyncSupport"] if "malSyncSupport" in entry else ""),
            hasDisqusSupport=(entry["hasDisqusSupport"] if "hasDisqusSupport" in entry else ""),
            hasReleaseSchedule=(entry["hasReleaseSchedule"] if "hasReleaseSchedule" in entry else ""),
            hasDirectDownloads=(entry["hasDirectDownloads"] if "hasDirectDownloads" in entry else ""),
            hasBatchDownloads=(entry["hasBatchDownloads"] if "hasBatchDownloads" in entry else ""),
            hasTorrents=(entry["hasTorrents"] if "hasTorrents" in entry else "")
        )
    elif table in manga_type:
        insert_data = insert_data | dict(
            hasAds=(entry["hasAds"] if "hasAds" in entry else ""),
            hasAntiAdblock=(entry["isAntiAdblock"] if "isAntiAdblock" in entry else ""),
            languages=get_language(entry),
            malSyncSupport=(entry["malSyncSupport"] if "malSyncSupport" in entry else ""),
            hasDisqusSupport=(entry["hasDisqusSupport"] if "hasDisqusSupport" in entry else ""),
            hasTachiyomiSupport=(entry["hasTachiyomiSupport"] if "hasTachiyomiSupport" in entry else "")
        )
    elif table in novel_type:
        insert_data = insert_data | dict(
            hasAds=(entry["hasAds"] if "hasAds" in entry else ""),
            hasAntiAdblock=(entry["isAntiAdblock"] if "isAntiAdblock" in entry else ""),
            languages=get_language(entry),
            hasDisqusSupport=(entry["hasDisqusSupport"] if "hasDisqusSupport" in entry else ""),
            hasDirectDownloads=(entry["hasDirectDownloads"] if "hasDirectDownloads" in entry else ""),
            hasMTL=(entry["hasMTL"] if "hasMTL" in entry else "")
        )
    elif table in app_type:
        insert_data = insert_data | dict(
            hasMalSupport=(entry["hasMalSupport"] if "hasMalSupport" in entry else ""),
            hasAnilistSupport=(entry["hasAnilistSupport"] if "hasAnilistSupport" in entry else ""),
            hasKitsuSupport=(entry["hasKitsuSupport"] if "hasKitsuSupport" in entry else ""),
            hasSimKLSupport=(entry["hasSimKLSupport"] if "hasSimKLSupport" in entry else "")
        )

    with dataset.connect(get_db()) as con:
        con[table].insert(insert_data)


def transfer_table(data, table, old_name):
    db = dataset.connect(get_db())
    db.create_table(table)
    for entry in data[old_name]:
        insert_db(table, entry)
    print("Migrated " + old_name + " -> " + table + " to DB.")


with open(os.path.join("static", "data.json"), encoding="utf8") as json_file:
    data = json.load(json_file)

# streaming sites
transfer_table(data, "englishAnimeSites", "englishAnimeSites")
transfer_table(data, "foreignAnimeSites", "foreignAnimeSites")
transfer_table(data, "downloadSites", "animeDownloadSites")

# manga/scans
transfer_table(data, "englishMangaAggregators", "englishMangaSites")
transfer_table(data, "englishMangaScans", "englishMangaScans")
transfer_table(data, "foreignMangaAggregators", "foreignMangaSites")
transfer_table(data, "foreignMangaScans", "foreignMangaScans")

# novel
transfer_table(data, "lightNovels", "lightNovels")
transfer_table(data, "visualNovels", "visualNovels")

# applications
transfer_table(data, "iosApplications", "iOSApplications")
transfer_table(data, "androidApplications", "androidApplications")
transfer_table(data, "windowsApplications", "windowsApplications")
transfer_table(data, "macOSApplications", "macOSApplications")
transfer_table(data, "browserExtensions", "browserExtensions")

# hentai
transfer_table(data, "hentaiAnimeSites", "hentaiAnime")
transfer_table(data, "hentaiDoujinshiSites", "hentaiDoujinshi")
transfer_table(data, "hentaiDownloadSites", "hentaiDownload")
transfer_table(data, "hentaiApplications", "hentaiApplications")

print("Migration process complete.")
