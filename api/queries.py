import json

from flask import jsonify, Blueprint

from models import Table, Tab, Column, Data

bp = Blueprint('queries_api', __name__)


@bp.route("/api/health")
def health():
    """Heartbeat used for uptime monitoring purposes."""
    return "Ok"


# ------------------------------------------------------------------------------
# tables endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables", methods=["GET"])
def resolve_tables():
    try:
        return jsonify([table.to_dict() for table in Table.query.all()])
    except Exception as e:
        return str(e), 500


@bp.route("/api/tables/<table_id>", methods=["GET"])
def resolve_table(table_id):
    try:
        table = Table.query.get(table_id)
        if table is None:
            return f"table {table_id} not found", 404
        return jsonify(table.to_dict())
    except Exception as e:
        return str(e), 500


# ------------------------------------------------------------------------------
# tabs endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tabs", methods=["GET"])
def resolve_tabs():
    try:
        return jsonify([tab.to_dict() for tab in Tab.query.all()])
    except Exception as e:
        return str(e), 500


@bp.route("/api/tabs/<tab_id>", methods=["GET"])
def resolve_tab(tab_id):
    try:
        tab = Tab.query.get(tab_id)
        if tab is None:
            return f"tab {tab_id} not found", 404
        return jsonify(tab.to_dict())
    except Exception as e:
        return str(e), 500


# ------------------------------------------------------------------------------
# columns endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/columns", methods=["GET"])
def resolve_columns():
    try:
        return jsonify([tab.to_dict() for tab in Column.query.all()])
    except Exception as e:
        return str(e), 500


@bp.route("/api/columns/<column_id>", methods=["GET"])
def resolve_column(column_id):
    try:
        column = Column.query.get(column_id)
        if column is None:
            return f"column {column_id} not found", 404
        return jsonify(column.to_dict())
    except Exception as e:
        return str(e), 500


# ------------------------------------------------------------------------------
# data endpoint
# ------------------------------------------------------------------------------
@bp.route("/api/tables/<table_id>/data", methods=["GET"])
def resolve_data(table_id):
    try:
        results = [json.loads(c.data) | dict(id=c.id) for c in Data.query.filter(Data.table.id == table_id).all()]
        return jsonify(results)
    except Exception as e:
        return str(e), 500
