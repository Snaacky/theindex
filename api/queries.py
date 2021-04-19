import json
import logging

from flask import jsonify, Blueprint

from models import Table, Tab, Column

bp = Blueprint('queries_api', __name__)


@bp.route("/api/health")
def health():
    """Heartbeat used for uptime monitoring purposes."""
    return "Ok"


@bp.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


# ------------------------------------------------------------------------------
# tables endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables", methods=["GET"])
def resolve_tables():
    try:
        return jsonify([table.to_dict() for table in Table.query.all()])
    except Exception as e:
        logging.error(str(e))
        return 500


@bp.route("/api/tables/<table_id>", methods=["GET"])
def resolve_table(table_id):
    try:
        table = Table.query.get_or_404(
            table_id,
            f"table {table_id} not found"
        )
        return jsonify(table.to_dict())
    except Exception as e:
        logging.error(str(e))
        return 500


# ------------------------------------------------------------------------------
# tabs endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tabs", methods=["GET"])
def resolve_tabs():
    try:
        return jsonify([tab.to_dict() for tab in Tab.query.all()])
    except Exception as e:
        logging.error(str(e))
        return 500


@bp.route("/api/tabs/<tab_id>", methods=["GET"])
def resolve_tab(tab_id):
    try:
        tab = Tab.query.get_or_404(
            tab_id,
            f"tab {tab_id} not found"
        )
        return jsonify(tab.to_dict())
    except Exception as e:
        logging.error(str(e))
        return 500


# ------------------------------------------------------------------------------
# columns endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/columns", methods=["GET"])
def resolve_columns():
    try:
        return jsonify([tab.to_dict() for tab in Column.query.all()])
    except Exception as e:
        logging.error(str(e))
        return 500


@bp.route("/api/columns/<column_id>", methods=["GET"])
def resolve_column(column_id):
    try:
        column = Column.query.get_or_404(
            column_id,
            f"Column {column_id} not found"
        )
        return jsonify(column.to_dict())
    except Exception as e:
        logging.error(str(e))
        return 500


# ------------------------------------------------------------------------------
# data endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables/<table_id>/data", methods=["GET"])
def resolve_datas(table_id):
    try:
        t = Table.query.get_or_404(table_id, f"Table {table_id} not found")
        results = [json.loads(c.data) | dict(id=c.id) for c in t.data]
        return jsonify(results)
    except Exception as e:
        logging.error(str(e))
        return 500


@bp.route("/api/tables/<table_id>/data/<data_id>", methods=["GET"])
def resolve_data(table_id, data_id):
    try:
        t = Table.query.get_or_404(table_id, f"Table {table_id} not found")
        for d in t.data:
            if d.id == data_id:
                return json.loads(d.data) | dict(id=d.id)
        return "data row not found", 403
    except Exception as e:
        logging.error(str(e))
        return 500
