import json
import os

import dataset
import flask

from flask import jsonify, request
from flask_discord import requires_authorization

app = flask.current_app
bp = flask.Blueprint('api', __name__)

database = "".join(["sqlite:///", os.path.join(os.getcwd(), "migration.db")])  # TODO: Migrate to a separate db.py file


@bp.route("/api/fetch/tables")
def fetch_tables():
    """ returns all tables """
    db = dataset.connect(database)
    return jsonify(db.tables)


@bp.route("/api/fetch/columns")
def fetch_columns():
    """ returns all columns """
    db = dataset.connect(database)
    columns = {}
    for table in db.tables:
        table = db.load_table(table)
        columns[table.name] = table.columns
    return jsonify(columns)


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
