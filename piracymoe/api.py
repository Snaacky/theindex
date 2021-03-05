import flask

from flask import render_template, redirect, url_for
from flask_discord import requires_authorization, Unauthorized

app = flask.current_app
bp = flask.Blueprint('api', __name__)


@bp.route("/update")
@requires_authorization
def update():
    return "hello world"

@bp.route("/fetch")
@requires_authorization
def fetch():
    return "hello world"