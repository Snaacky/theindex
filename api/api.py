import json

from flask import jsonify, request, Blueprint, current_app
from flask_discord import requires_authorization

import utils
import db

app = current_app
bp = Blueprint('api', __name__)


@bp.route("/api/health")
def health():
    """ Heartbeat used for uptime monitoring purposes. """
    return "Ok"


@bp.route("/api/fetch/tabs")
def fetch_tabs():
    """ Used by the frontend, returns a JSON list of all the tabs including metadata. """

    return jsonify(utils.tabs())


@bp.route("/api/fetch/tables")
def fetch_tables():
    """ Used by the frontend, returns a JSON list of all the tables including metadata. """

    return jsonify(utils.tables())


@bp.route("/api/fetch/columns")
def fetch_columns():
    """ Used by the frontend, returns a JSON list of all the columns in use with metadata. """

    return jsonify(utils.columns())


@bp.route("/api/fetch/table_types")
def fetch_table_types():
    """ Used by the frontend, returns a JSON list of all the columns in use with metadata. """

    return jsonify(utils.table_types())


@bp.route("/api/fetch/columns/<table>")
def fetch_columns_by_table(table):
    """ Used by the frontend, returns a JSON list of all the columns for the table specified. """

    result = utils.columns(table)
    if isinstance(result, str):
        return result
    return jsonify(result)


@bp.route("/api/fetch/tables/<tab>")
def fetch_tables_by_tab(tab):
    """ 
    Used by the frontend, returns a JSON list of all the tables for the tab specified. 

        Parameters:
            tab (str): The tab requested by the frontend.

        Returns:
            data (flask.Response): Response containing a list of the tabs tables in JSON format.
    """

    return jsonify(utils.tab(tab))


@bp.route("/api/fetch/data/<table>")
def fetch_data_by_table(table):
    """ 
    Used by the frontend, returns a JSON list of all the data (rows and columns) for the table specified. 

        Parameters:
            table (str): The table requested by the frontend.

        Returns:
            data (flask.Response): Response containing the data in JSON format.
    """
    results = db.get_data(table)

    # on error return
    if isinstance(results, str):
        return results

    data = []
    for row in results:
        row["siteAddresses"] = json.loads(row["siteAddresses"])
        data.append(row)
    return jsonify(data)


@bp.route("/api/update/<table>", methods=["POST"])
@requires_authorization
def update_table_entry(table):
    # attempt to get POST data
    data = request.get_json()

    # error if did not receive POST data
    if not data:
        return "received no POST JSON data"

    # lookup entry from POST data in database by id
    before = dict(db.get_row(table, data["id"]))

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="update",
                                table=table.name, before=before,
                                after=data)

    data["siteAddresses"] = json.dumps(data["siteAddresses"])
    return db.update_row(table, data)


@bp.route("/api/insert/<table>", methods=["POST"])
@requires_authorization
def insert_new_entry(table):
    """ insert new data entry in table """

    data = request.get_json()
    if not data:
        return "received no POST JSON data"

    data["siteAddresses"] = json.dumps(data["siteAddresses"])

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="insert",
                                table=table.name, after=data)

    return db.insert_row(table, data)


@bp.route("/api/delete/<table>/<id>")
@requires_authorization
def delete_entry(table, id):
    """ deletes data entry in table """

    data = db.get_row(table, id)
    if isinstance(data, str):
        return data

    utils._send_webhook_message(user=app.discord.fetch_user(), operation="delete",
                                table=table.name, after=data)

    return db.delete_row(table, id)
