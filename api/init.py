# This python file should only be run once when the server hasn't been configured yet!
# It will generate the missing data.db with the default value and structure

import json
import os

from app import create_app, db
from models import Column, TableColumn, Tab, Table, Data

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


def check_entry(entry, key):
    if key in entry:
        return entry[key]
    return ""


def get_dict(data, keys):
    result = dict()
    for key in keys:
        result[key] = check_entry(data, key)
    return result


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
    insert_data = get_dict(entry, [
        "siteName",
        "isMobileFriendly",
        "features",
        "editorNotes"
    ]) | dict(siteAddresses=json.dumps(entry["siteAddresses"]))
    if table in anime_type:
        insert_data = insert_data | get_dict(entry, [
            "hasAds",
            "hasAntiAdblock",
            "resolution360p",
            "resolution480p",
            "resolution720p",
            "resolution1080p",
            "hasSubs",
            "hasDubs",
            "hasWatermarks",
            "malSyncSupport",
            "hasDisqusSupport",
            "hasReleaseSchedule",
            "hasDirectDownloads",
            "hasBatchDownloads"
        ]) | dict(languages=get_language(entry))
    elif table in download_type:
        insert_data = insert_data | get_dict(entry, [
            "hasAds",
            "hasAntiAdblock",
            "resolution360p",
            "resolution480p",
            "resolution720p",
            "resolution1080p",
            "hasSubs",
            "hasDubs",
            "hasWatermarks",
            "malSyncSupport",
            "hasDisqusSupport",
            "hasReleaseSchedule",
            "hasDirectDownloads",
            "hasBatchDownloads",
            "hasTorrents"
        ]) | dict(languages=get_language(entry))
    elif table in manga_type:
        insert_data = insert_data | get_dict(entry, [
            "hasAds",
            "hasAntiAdblock",
            "malSyncSupport",
            "hasDisqusSupport",
            "hasTachiyomiSupport"
        ]) | dict(languages=get_language(entry))
    elif table in novel_type:
        insert_data = insert_data | get_dict(entry, [
            "hasAds",
            "hasAntiAdblock",
            "malSyncSupport",
            "hasDisqusSupport",
            "hasDirectDownloads",
            "hasMTL"
        ]) | dict(languages=get_language(entry))
    elif table in app_type:
        insert_data = insert_data | get_dict(entry, [
            "hasMalSupport",
            "hasAnilistSupport",
            "hasKitsuSupport",
            "hasSimKLSupport"
        ])

    t = Table.query.filter_by(name=table).first()
    d = Data(data=json.dumps(insert_data), table_id=t.id)
    db.session.add(d)
    db.session.commit()


def transfer_table(data, table):
    for entry in data[table]:
        insert_db(table, entry)
    print("Migrated " + table + " to DB.")


if __name__ == "__main__":

    with create_app().app_context():

        # Checks the database to see if there's at least 1 tab
        if Table.query.get(1):
            print("DB found skipping init script")
            exit()

        print("No DB found running init script")
        # Loads the data that'll get imported
        with open(os.path.join('static', 'columns.json')) as json_file:
            columns_data = json.load(json_file)
        with open(os.path.join('static', 'tables.json')) as json_file:
            tables_data = json.load(json_file)

        for key in columns_data["keys"].keys():
            c = columns_data["keys"][key]
            col = Column(
                name=c["name"],
                key=key,
                column_type=c["type"],
                description=c["description"]
            )
            db.session.add(col)
        db.session.commit()
        print("column table generated")
        for c in Column.query.all():
            print(c.to_dict())

        for tab in tables_data:
            db.session.add(Tab(name=tab["tab"], description=tab["name"]))
            db.session.commit()
            order = 0
            gen_tab = Tab.query.filter_by(name=tab["tab"]).first()
            for t in tab["tables"]:
                db.session.add(Table(name=t["id"], tab_id=gen_tab.id, description=t["title"], order=order))
                order += 1
        db.session.commit()
        print("tables table generated")
        print("tabs table generated")
        for c in Table.query.all():
            print(c.to_dict())
        for c in Tab.query.all():
            print(c.to_dict())

        for tab in tables_data:
            for t in tab["tables"]:
                order = 0
                for c in columns_data["types"][t["type"]]:
                    col = Column.query.filter_by(name=columns_data["keys"][c["key"]]["name"]).first()
                    table = Table.query.filter_by(name=t["id"]).first()
                    tc = TableColumn(
                        table_id=table.id,
                        column_id=col.id,
                        order=order,
                        hidden=c["hidden"]
                    )
                    db.session.add(tc)
                    order += 1
        db.session.commit()
        print("tablecolumn table generated")
        for c in TableColumn.query.all():
            print(c.to_dict())

        with open(os.path.join("static", "data.json"), encoding="utf8") as json_file:
            old_data = json.load(json_file)

        # streaming sites
        transfer_table(old_data, "englishAnimeSites")
        transfer_table(old_data, "foreignAnimeSites")
        transfer_table(old_data, "downloadSites")

        # manga/scans
        transfer_table(old_data, "englishMangaAggregators")
        transfer_table(old_data, "englishMangaScans")
        transfer_table(old_data, "foreignMangaAggregators")
        transfer_table(old_data, "foreignMangaScans")

        # novel
        transfer_table(old_data, "lightNovels")
        transfer_table(old_data, "visualNovels")

        # applications
        transfer_table(old_data, "iosApplications")
        transfer_table(old_data, "androidApplications")
        transfer_table(old_data, "windowsApplications")
        transfer_table(old_data, "macOSApplications")
        transfer_table(old_data, "browserExtensions")

        # hentai
        transfer_table(old_data, "hentaiAnimeSites")
        transfer_table(old_data, "hentaiDoujinshiSites")
        transfer_table(old_data, "hentaiDownloadSites")
        transfer_table(old_data, "hentaiApplications")

        print("Initialization process complete.")
