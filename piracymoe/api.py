import json
import os

import dataset
import flask
from flask import jsonify, request
from flask_discord import requires_authorization

app = flask.current_app
bp = flask.Blueprint('api', __name__)

database = "".join(["sqlite:///", os.path.join("/config", "data.db")])  # TODO: Migrate to a separate db.py file


@bp.route("/api/health")
def health():
    """ heartbeat """
    return "Ok"


@bp.route("/api/fetch/tables")
def fetch_tables():
    """ returns all tables """
    """
    we cannot use this, as we will loose infromation about the title and type of columns which are being used and what
    the tab-id is
    db = dataset.connect(database)
    return jsonify(db.tables)
    """
    return jsonify([
        {
            "tab": "animeTables",
            "name": "Anime",
            "tables": [
                {
                    "id": "englishAnimeSites",
                    "title": "English Streaming Sites",
                    "type": "anime"
                },
                {
                    "id": "foreignAnimeSites",
                    "title": "Foreign Streaming Sites",
                    "type": "anime"
                },
                {
                    "id": "downloadSites",
                    "title": "Download Only Sites",
                    "type": "animeDownload"
                }
            ]
        },
        {
            "tab": "mangaTables",
            "name": "Manga",
            "tables": [
                {
                    "id": "englishMangaAggregators",
                    "title": "Aggregators",
                    "type": "manga"
                },
                {
                    "id": "foreignMangaAggregators",
                    "title": "Non-English Aggregators",
                    "type": "manga"
                },
                {
                    "id": "englishMangaScans",
                    "title": "Scans",
                    "type": "manga"
                },
                {
                    "id": "foreignMangaScans",
                    "title": "Non-English Scans",
                    "type": "manga"
                }
            ]
        },
        {
            "tab": "lightNovelTables",
            "name": "Novels",
            "tables": [
                {
                    "id": "lightNovels",
                    "title": "Light Novels",
                    "type": "novel"
                },
                {
                    "id": "visualNovels",
                    "title": "Visual Novels",
                    "type": "novel"
                }
            ]
        },
        {
            "tab": "applicationsTables",
            "name": "Applications",
            "tables": [
                {
                    "id": "iosApplications",
                    "title": "iOS",
                    "type": "application"
                },
                {
                    "id": "androidApplications",
                    "title": "Android",
                    "type": "application"
                },
                {
                    "id": "windowsApplications",
                    "title": "Windows",
                    "type": "application"
                },
                {
                    "id": "macOSApplications",
                    "title": "macOS",
                    "type": "application"
                },
                {
                    "id": "browserExtensions",
                    "title": "Browser Extensions",
                    "type": "application"
                }
            ]
        },
        {
            "tab": "hentaiTables",
            "name": "Hentai",
            "tables": [
                {
                    "id": "hentaiAnimeSites",
                    "title": "Hentai Anime Streaming Sites",
                    "type": "anime"
                },
                {
                    "id": "hentaiDoujinshiSites",
                    "title": "Hentai Manga/Image Boards/LN sites",
                    "type": "novel"
                },
                {
                    "id": "hentaiDownloadSites",
                    "title": "Hentai Download",
                    "type": "animeDownload"
                },
                {
                    "id": "hentaiApplications",
                    "title": "Hentai Applications",
                    "type": "application"
                }
            ]
        }
    ])


@bp.route("/api/fetch/columns")
def fetch_columns():
    """ returns all columns """
    """
    we cannot use this as we would lose information about what columns are hidden by default or their title/description
    db = dataset.connect(database)
    for table in db.tables:
        table = db.load_table(table)
        columns[table.name] = table.columns
    return jsonify(columns)
    """
    return jsonify({
        "keys": {
            "siteName": {
                "name": "Name",
                "description": "The sites name"
            },
            "siteAddresses": {
                "name": "Address",
                "description": "The sites address"
            },
            "hasAds": {
                "name": "Ads",
                "description": "Does the site have ads"
            },
            "hasAntiAdblock": {
                "name": "Anti-Adblock",
                "description": "Does the site block adblockers"
            },
            "hasSubs": {
                "name": "Subs",
                "description": "Does the site offer subs"
            },
            "hasDubs": {
                "name": "Dubs",
                "description": "Does the site offer dubs"
            },
            "resolution360p": {
                "name": "360p",
                "description": "Does the site offer 360p streams"
            },
            "resolution480p": {
                "name": "480p",
                "description": "Does the site offer 480p streams"
            },
            "resolution720p": {
                "name": "720p",
                "description": "Does the site offer 720p streams"
            },
            "resolution1080p": {
                "name": "1080p",
                "description": "Does the site offer 1080p streams"
            },
            "otherLanguages": {
                "name": "Languages",
                "description": "What language does the site support"
            },
            "hasReleaseSchedule": {
                "name": "Schedule",
                "description": "Does the site have a schedule listing"
            },
            "hasDirectDownloads": {
                "name": "DL",
                "description": "Does the site offer downloads"
            },
            "hasBatchDownloads": {
                "name": "Batch DL",
                "description": "Does the site offer batch downloads"
            },
            "hasTorrents": {
                "name": "Torrents",
                "description": "Does the site offer torrents"
            },
            "isMobileFriendly": {
                "name": "Mobile",
                "description": "Is the site friendly on mobile"
            },
            "isEnglish": {
                "name": "English",
                "description": "Is this site in English"
            },
            "malSyncSupport": {
                "name": "MAL-Sync",
                "description": "Does the site have MAL-Sync support"
            },
            "hasTags": {
                "name": "Tags",
                "description": "Does the site have a tagging feature"
            },
            "hasWatermarks": {
                "name": "Watermark",
                "description": "Does the site have watermarks"
            },
            "hasDisqusSupport": {
                "name": "Disqus",
                "description": "Does the site have a Disqus comments section"
            },
            "editorNotes": {
                "name": "Notes",
                "description": "Any additional notes from the index editors"
            },
            "hasTachiyomiSupport": {
                "name": "Tachiyomi",
                "description": "Is Tachiyomi supported"
            },
            "hasMalSupport": {
                "name": "MAL",
                "description": "Is MAL supported"
            },
            "hasAnilistSupport": {
                "name": "Anilist",
                "description": "Is Anilist supported"
            },
            "hasKitsuSupport": {
                "name": "Kitsu",
                "description": "Is Kitsu supported"
            },
            "hasSimKLSupport": {
                "name": "SimKL",
                "description": "Is SimKL supported"
            },
            "siteFeatures": {
                "name": "Features",
                "description": "This extensions features"
            },
            "siteLanguage": {
                "name": "Site Language",
                "description": "The main language of the site"
            },
            "supportPlatform": {
                "name": "Platform",
                "description": "Is this application available for platform"
            }
        },
        "types": {
            "anime": [
                {
                    "key": "siteName",
                    "hidden": False
                },
                {
                    "key": "hasAds",
                    "hidden": False
                },
                {
                    "key": "hasAntiAdblock",
                    "hidden": True
                },
                {
                    "key": "hasSubs",
                    "hidden": False
                },
                {
                    "key": "hasDubs",
                    "hidden": False
                },
                {
                    "key": "resolution1080p",
                    "hidden": False
                },
                {
                    "key": "resolution720p",
                    "hidden": False
                },
                {
                    "key": "resolution480p",
                    "hidden": False
                },
                {
                    "key": "resolution360p",
                    "hidden": False
                },
                {
                    "key": "otherLanguages",
                    "hidden": True
                },
                {
                    "key": "hasReleaseSchedule",
                    "hidden": False
                },
                {
                    "key": "hasDirectDownloads",
                    "hidden": False
                },
                {
                    "key": "hasBatchDownloads",
                    "hidden": True
                },
                {
                    "key": "isMobileFriendly",
                    "hidden": True
                },
                {
                    "key": "malSyncSupport",
                    "hidden": False
                },
                {
                    "key": "hasWatermarks",
                    "hidden": True
                },
                {
                    "key": "hasDisqusSupport",
                    "hidden": True
                },
                {
                    "key": "editorNotes",
                    "hidden": True
                }
            ],
            "animeDownload": [
                {
                    "key": "siteName",
                    "hidden": False
                },
                {
                    "key": "hasAds",
                    "hidden": False
                },
                {
                    "key": "hasAntiAdblock",
                    "hidden": True
                },
                {
                    "key": "hasSubs",
                    "hidden": False
                },
                {
                    "key": "hasDubs",
                    "hidden": False
                },
                {
                    "key": "resolution1080p",
                    "hidden": False
                },
                {
                    "key": "resolution720p",
                    "hidden": False
                },
                {
                    "key": "resolution480p",
                    "hidden": False
                },
                {
                    "key": "resolution360p",
                    "hidden": False
                },
                {
                    "key": "otherLanguages",
                    "hidden": True
                },
                {
                    "key": "hasReleaseSchedule",
                    "hidden": False
                },
                {
                    "key": "hasDirectDownloads",
                    "hidden": False
                },
                {
                    "key": "hasBatchDownloads",
                    "hidden": True
                },
                {
                    "key": "hasTorrents",
                    "hidden": True
                },
                {
                    "key": "isMobileFriendly",
                    "hidden": True
                },
                {
                    "key": "hasWatermarks",
                    "hidden": True
                },
                {
                    "key": "hasDisqusSupport",
                    "hidden": True
                },
                {
                    "key": "editorNotes",
                    "hidden": True
                }
            ],
            "manga": [
                {
                    "key": "siteName",
                    "hidden": False
                },
                {
                    "key": "hasAds",
                    "hidden": False
                },
                {
                    "key": "hasAntiAdblock",
                    "hidden": True
                },
                {
                    "key": "isEnglish",
                    "hidden": False
                },
                {
                    "key": "otherLanguages",
                    "hidden": False
                },
                {
                    "key": "isMobileFriendly",
                    "hidden": True
                },
                {
                    "key": "malSyncSupport",
                    "hidden": False
                },
                {
                    "key": "hasTachiyomiSupport",
                    "hidden": False
                },
                {
                    "key": "editorNotes",
                    "hidden": True
                }
            ],
            "novel": [
                {
                    "key": "siteName",
                    "hidden": False
                },
                {
                    "key": "hasAds",
                    "hidden": False
                },
                {
                    "key": "hasAntiAdblock",
                    "hidden": True
                },
                {
                    "key": "siteLanguage",
                    "hidden": False
                },
                {
                    "key": "otherLanguages",
                    "hidden": False
                },
                {
                    "key": "hasDirectDownloads",
                    "hidden": False
                },
                {
                    "key": "hasBatchDownloads",
                    "hidden": True
                },
                {
                    "key": "hasTorrents",
                    "hidden": True
                },
                {
                    "key": "isMobileFriendly",
                    "hidden": True
                },
                {
                    "key": "editorNotes",
                    "hidden": True
                }
            ],
            "application": [
                {
                    "key": "siteName",
                    "hidden": False
                },
                {
                    "key": "supportPlatform",
                    "hidden": True
                },
                {
                    "key": "hasMalSupport",
                    "hidden": False
                },
                {
                    "key": "hasAnilistSupport",
                    "hidden": False
                },
                {
                    "key": "hasKitsuSupport",
                    "hidden": False
                },
                {
                    "key": "hasSimKLSupport",
                    "hidden": False
                },
                {
                    "key": "siteFeatures",
                    "hidden": False
                },
                {
                    "key": "editorNotes",
                    "hidden": True
                }
            ]
        }
    })


@bp.route("/api/fetch/columns/<table>")
def fetch_columns_by_table(table):
    """ returns columns by table """
    db = dataset.connect(database)
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    return jsonify(table.columns)


@bp.route("/api/fetch/tables/<tab>")
def fetch_tables_by_tab(tab):
    """ returns tables by tab """
    tabs = {
        "anime": ["englishAnimeSites", "foreignAnimeSites", "downloadSites"],
        "manga": ["englishMangaAggregators", "englishMangaScans", "foreignMangaAggregators", "foreignMangaScans"],
        "novels": ["lightNovels", "visualNovels"],
        "applications": ["androidApplications", "browserExtensions", "iosApplications", "macOSApplications",
                         "visualNovels", "windowsApplications"],
        "hentai": ["hentaiAnimeSites", "hentaiApplications", "hentaiDoujinshiSites", "hentaiDownloadSites"]
    }

    if tab not in tabs:
        return "tab does not exist"

    return jsonify(tabs[tab])


@bp.route("/api/fetch/data/<table>")
def fetch_data_by_table(table):
    """ returns data by table """
    db = dataset.connect(database)
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    data = []
    for row in table:
        row["siteAddresses"] = json.loads(row["siteAddresses"])
        data.append(row)
    return jsonify(data)


@bp.route("/api/fetch/ping/<table>")
@requires_authorization
def fetch_ping_by_table(table):
    """ returns ping results by table """
    return "hello world"


@bp.route("/api/update/<table>", methods=["POST"])
@requires_authorization
def update_table_entry(table):
    db = dataset.connect(database)
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    data = request.get_json()
    if not data:
        return "received no POST JSON data"

    row = table.find_one(id=data["id"])
    if row is None:
        return "id does not exist"

    table.update(data, ["id"])
    return "updated"


@bp.route("/api/create/<table>", methods=["POST"])
@requires_authorization
def create_new_entry(table):
    """ creates new data entry in table, **does not create new tables** """
    db = dataset.connect(database)
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    row = request.get_json()
    if not row:
        return "received no POST JSON data"

    row["siteAddresses"] = json.dumps(row["siteAddresses"])
    table.insert(row)
    return "inserted"


@bp.route("/api/delete/<table>/<id>")
@requires_authorization
def delete_entry(table, id):
    """ deletes data entry in table """
    db = dataset.connect(database)
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    row = table.find_one(id=id)
    if row is None:
        return "id does not exist"

    table.delete(id=id)
    return "deleted"


@bp.route("/api/cache/<table>/clear")
@requires_authorization
def clear_cache_for_table(table):
    """ for manual cache data + ping refreshing when needed """
    return "hello world"


@bp.route("/api/cache/ping/clear")
@requires_authorization
def clear_ping_cache(table):
    """ for manual clearing all ping caches when needed """
    return "hello world"
