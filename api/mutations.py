import json
import logging

from flask import Blueprint, request, current_app
from flask_discord import requires_authorization

import utils
from app import db
from models import Table, Tab, Column, Data

bp = Blueprint('mutation_api', __name__)


# ------------------------------------------------------------------------------
# tables endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables", methods=["POST"])
@requires_authorization
def create_table():
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    insert = Table(data["name"], data["description"], Tab.query.get(data["tab.id"]))

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} created new table {data}")
    utils._send_webhook_message(user=user, operation="insert",
                                table=data["name"], after=data)

    try:
        db.session.add(insert)
        db.session.commit()
    except Exception as e:
        return "Insert table %s failed: %s" % (data, str(e)), 500
    return "Ok"


@bp.route("/api/tables/<table_id>", methods=["PUT"])
@requires_authorization
def update_table(table_id):
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    update = Table.query.get(table_id)
    old = update.to_dict()
    update.name = data["name"]
    update.description = data["description"]
    update.tab = Tab.query.get(data["tab"])
    update.columns = [Tab.query.get(t["tab.id"]) for t in data["columns"]]

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} updated table {table_id}")
    utils._send_webhook_message(user=user, operation="update",
                                table=update.name, before=old,
                                after=data)

    try:
        db.session.commit()
    except Exception as e:
        return "Update of table %s failed: %s" % (table_id, str(e)), 500
    return "Ok"


@bp.route("/api/tables/<table_id>", methods=["DELETE"])
@requires_authorization
def delete_table(table_id):
    table = Table.query.get(table_id)
    data = table.to_dict()

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} deleted table {table_id}")
    utils._send_webhook_message(user=user, operation="delete",
                                table=data.name, after=data)

    try:
        db.session.delete(table)
        db.session.commit()
    except Exception as e:
        return "Delete of table %s failed: %s" % (table_id, str(e)), 500
    return "Ok"


# ------------------------------------------------------------------------------
# tabs endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tabs", methods=["POST"])
@requires_authorization
def create_tab():
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    insert = Tab(data["name"], data["description"])

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} created new tab {data}")
    utils._send_webhook_message(user=user, operation="insert",
                                table=data["name"], after=data)

    try:
        db.session.add(insert)
        db.session.commit()
    except Exception as e:
        return "Insert tab %s failed: %s" % (data, str(e)), 500
    return "Ok"


@bp.route("/api/tabs/<tab_id>", methods=["PUT"])
@requires_authorization
def update_tab(tab_id):
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    update = Tab.query.get(tab_id)
    old = update.to_dict()
    update.name = data["name"]
    update.description = data["description"]
    update.tables = [Tab.query.get(t["table.id"]) for t in data["tables"]]

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} updated tab {tab_id}")
    utils._send_webhook_message(user=user, operation="update",
                                table=update.name, before=old,
                                after=data)

    try:
        db.session.commit()
    except Exception as e:
        return "Update of tab %s failed: %s" % (tab_id, str(e)), 500
    return "Ok"


@bp.route("/api/tabs/<tab_id>", methods=["DELETE"])
@requires_authorization
def delete_tab(tab_id):
    delete = Tab.query.get(tab_id)
    data = delete.to_dict()

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} deleted tab {tab_id}")
    utils._send_webhook_message(user=user, operation="delete",
                                table=data.name, after=data)

    try:
        db.session.delete(delete)
        db.session.commit()
    except Exception as e:
        return "Delete of tab %s failed: %s" % (tab_id, str(e)), 500
    return "Ok"


# ------------------------------------------------------------------------------
# columns endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/columns", methods=["POST"])
@requires_authorization
def create_column():
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    insert = Column(data["name"], data["description"], data["column_type"])

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} created new column {data}")
    utils._send_webhook_message(user=user, operation="insert",
                                table=data["name"], after=data)

    try:
        db.session.add(insert)
        db.session.commit()
    except Exception as e:
        return "Insert column %s failed: %s" % (data, str(e)), 500
    return "Ok"


@bp.route("/api/columns/<column_id>", methods=["PUT"])
@requires_authorization
def update_column(column_id):
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    update = Column.query.get(column_id)
    old = update.to_dict()
    update.name = data["name"]
    update.description = data["description"]
    update.tab = Column.query.get(data["tab.id"])

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} updated column {column_id}")
    utils._send_webhook_message(user=user, operation="update",
                                table=update.name, before=old,
                                after=data)

    try:
        db.session.commit()
    except Exception as e:
        return "Update of column %s failed: %s" % (column_id, str(e)), 500
    return "Ok"


@bp.route("/api/columns/<column_id>", methods=["DELETE"])
@requires_authorization
def delete_column(column_id):
    delete = Column.query.get_or_404(column_id, "column %s not found" % column_id)
    data = delete.to_dict()

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} deleted column {column_id}")
    utils._send_webhook_message(user=user, operation="delete",
                                table=data.name, after=data)

    try:
        db.session.delete(delete)
        db.session.commit()
    except Exception as e:
        return "Delete of column %s failed: %s" % (column_id, str(e)), 500
    return "Ok"


# ------------------------------------------------------------------------------
# data endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables/<table_id>/data", methods=["POST"])
@requires_authorization
def create_data(table_id):
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 403

    insert = Data(json.dumps(data), Table.query.get(table_id))
    user = current_app.discord.fetch_user()
    logging.info(f"User {user} created new table {data}")
    utils._send_webhook_message(user=user, operation="insert",
                                table=data["name"], after=data)

    try:
        db.session.add(insert)
        db.session.commit()
    except Exception as e:
        return "Insert table %s failed: %s" % (data, str(e)), 500
    return "Ok"


@bp.route("/api/tables/<table_id>/data/<data_id>", methods=["PUT"])
@requires_authorization
def update_data(table_id, data_id):
    data = request.get_json()
    if not data:
        return "received no POST JSON data", 400

    row = Data.query.filter(Data.table.id == table_id).get_or_404(
        data_id,
        "row %s not found in table %s" % (data_id, table_id)
    )
    old = row.to_dict()

    # strip id of data to save
    if "id" in data:
        del data["id"]
    row.data = json.dumps(data)

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} updated row {data_id} in table {table_id}")
    utils._send_webhook_message(user=user, operation="update",
                                table=table_id, before=old,
                                after=data)

    try:
        db.session.commit()
    except Exception as e:
        return "Update of row %s in table %s failed: %s" % (data_id, table_id, str(e)), 500
    return "Ok"


@bp.route("/api/tables/<table_id>/data/<data_id>", methods=["DELETE"])
@requires_authorization
def delete_entry(table_id, data_id):
    delete = Data.query.filter(Data.table.id == table_id).get_or_404(
        data_id,
        "row %s not found in table %s" % (data_id, table_id)
    )
    data = delete.to_dict()

    user = current_app.discord.fetch_user()
    logging.info(f"User {user} deleted row {data_id}")
    utils._send_webhook_message(user=user, operation="delete",
                                table=Table.query.get(table_id).name, after=data)

    try:
        db.session.delete(delete)
        db.session.commit()
    except Exception as e:
        return "Delete of row %s in table %s failed: %s" % (data_id, table_id, str(e)), 500
    return "Ok"
