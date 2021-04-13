# This python file should only be run once when the server hasn't been configured yet!
# It will generate the missing data.db with the default value and structure

import json
import os

from app import db

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

    con = db.get_db()
    con["table_" + table].insert(insert_data)


def transfer_table(data, table, old_name):
    db.create_table("table_" + table)
    for entry in data[old_name]:
        insert_db(table, entry)
    print("Migrated " + old_name + " -> table_" + table + " to DB.")


if __name__ == "__main__":
    with open(os.path.join('../static', 'columns.json')) as json_file:
        columns_data = json.load(json_file)
    with open(os.path.join('../static', 'tables.json')) as json_file:
        tables_data = json.load(json_file)

    con = db.get_db()

    for key in columns_data["keys"].keys():
        column = columns_data["keys"][key]
        con["columns"].insert(dict(
            key=key,
            name=column["name"],
            description=column["description"],
            type=column["type"]
        ))
    print("columns table generated")

    for t in columns_data["types"].keys():
        con["table_types"].insert(dict(
            name=t
        ))
        order = 0
        for column in columns_data["types"][t]:
            con["type_" + t].insert(dict(
                key=column["key"],
                hidden=column["hidden"],
                order=order
            ))
            order += 1
    print("table_types table generated")

    for tab in tables_data:
        con["tabs"].insert(dict(
            key=tab["tab"],
            name=tab["name"]
        ))

        order = 0
        for table in tab["tables"]:
            con["tables"].insert(dict(
                key=table["id"],
                title=table["title"],
                type=table["type"]
            ))

            con["tab_" + tab["tab"]].insert(dict(
                key=table["id"],
                order=order
            ))
            order += 1
    print("tables table generated")
    print("tabs table generated")

    with open(os.path.join("../static", "data.json"), encoding="utf8") as json_file:
        old_data = json.load(json_file)

    # streaming sites
    transfer_table(old_data, "englishAnimeSites", "englishAnimeSites")
    transfer_table(old_data, "foreignAnimeSites", "foreignAnimeSites")
    transfer_table(old_data, "downloadSites", "animeDownloadSites")

    # manga/scans
    transfer_table(old_data, "englishMangaAggregators", "englishMangaSites")
    transfer_table(old_data, "englishMangaScans", "englishMangaScans")
    transfer_table(old_data, "foreignMangaAggregators", "foreignMangaSites")
    transfer_table(old_data, "foreignMangaScans", "foreignMangaScans")

    # novel
    transfer_table(old_data, "lightNovels", "lightNovels")
    transfer_table(old_data, "visualNovels", "visualNovels")

    # applications
    transfer_table(old_data, "iosApplications", "iOSApplications")
    transfer_table(old_data, "androidApplications", "androidApplications")
    transfer_table(old_data, "windowsApplications", "windowsApplications")
    transfer_table(old_data, "macOSApplications", "macOSApplications")
    transfer_table(old_data, "browserExtensions", "browserExtensions")

    # hentai
    transfer_table(old_data, "hentaiAnimeSites", "hentaiAnime")
    transfer_table(old_data, "hentaiDoujinshiSites", "hentaiDoujinshi")
    transfer_table(old_data, "hentaiDownloadSites", "hentaiDownload")
    transfer_table(old_data, "hentaiApplications", "hentaiApplications")

    print("Initialization process complete.")
