import json

from flask import jsonify, request, Blueprint, current_app
from flask_discord import requires_authorization

from piracymoe import utils

app = current_app
bp = Blueprint('api', __name__)


@bp.route("/api/health")
def health():
    """ Heartbeat used for uptime monitoring purposes. """
    return "Ok"

@bp.route("/api/fetch/tables")
def fetch_tables():
    """ Used by the frontend, returns a JSON list of all the tables including metadata. """
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
    """ Used by the frontend, returns a JSON list of all the columns in use with metadata. """
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
            "languages": {
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
            "hasMTL": {
                "name": "MTL",
                "description": "Does the site use machine translation"
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
            "features": {
                "name": "Features",
                "description": "Available features"
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
                    "key": "languages",
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
                    "key": "features",
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
                    "key": "languages",
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
                    "key": "features",
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
                    "key": "languages",
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
                    "key": "features",
                    "hidden": True
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
                    "key": "languages",
                    "hidden": False
                },
                {
                    "key": "hasMTL",
                    "hidden": False
                },
                {
                    "key": "hasDirectDownloads",
                    "hidden": False
                },
                {
                    "key": "isMobileFriendly",
                    "hidden": True
                },
                {
                    "key": "features",
                    "hidden": False
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
                    "key": "features",
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
    """ Used by the frontend, returns a JSON list of all the columns for the table specified. """
    db = utils._get_database()
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    return jsonify(table.columns)


@bp.route("/api/fetch/tables/<tab>")
def fetch_tables_by_tab(tab):
    """ 
    Used by the frontend, returns a JSON list of all the tables for the tab specified. 

        Parameters:
            tab (str): The tab requested by the frontend.

        Returns:
            data (flask.Response): Response containing a list of the tabs tables in JSON format.
    """
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
    """ 
    Used by the frontend, returns a JSON list of all the data (rows and columns) for the table specified. 

        Parameters:
            table (str): The table requested by the frontend.

        Returns:
            data (flask.Response): Response containing the data in JSON format.
    """
    db = utils._get_database()
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    """ 
    For some reason, accessing all the data in the table
    as Python objects causes a memory leak that results
    in memory exhaustion and an endless crash-reboot
    loop but this manual SQL query works just fine. :^)
    """
    results = db.query(f"SELECT * from {table.name}")
    data = []
    for row in results:
        row["siteAddresses"] = json.loads(row["siteAddresses"])
        data.append(row)
    return jsonify(data)


@bp.route("/api/update/<table>", methods=["POST"])
@requires_authorization
def update_table_entry(table):
    db = utils._get_database()
    table = db.load_table(table)

    # error if table doesn't exist
    if not table.exists:
        return "table does not exist"

    # attempt to get POST data
    data = request.get_json()

    # error if did not receive POST data
    if not data:
        return "received no POST JSON data"

    # lookup entry from POST data in database by id
    before = table.find_one(id=data["id"])

    # error if did entry did not exist in database
    if before is None:
        return "id does not exist"

    data["siteAddresses"] = json.dumps(data["siteAddresses"])

    before = dict(before)
    after = request.get_json()

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="update",
                                table=table.name, before=before, 
                                after=after)

    table.update(data, ["id"])
    return "updated"


@bp.route("/api/insert/<table>", methods=["POST"])
@requires_authorization
def insert_new_entry(table):
    """ insert new data entry in table """
    db = utils._get_database()
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    data = request.get_json()
    if not data:
        return "received no POST JSON data"

    data["siteAddresses"] = json.dumps(data["siteAddresses"])

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="insert",
                                table=table.name, after=data)
    
    table.insert(data)
    return "inserted"


@bp.route("/api/delete/<table>/<id>")
@requires_authorization
def delete_entry(table, id):
    """ deletes data entry in table """
    db = utils._get_database()
    table = db.load_table(table)

    if not table.exists:
        return "table does not exist"

    data = table.find_one(id=id)
    if data is None:
        return "id does not exist"

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="delete",
                                table=table.name, after=data)

    table.delete(id=id)
    return "deleted"