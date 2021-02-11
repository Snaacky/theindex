import os

import flask
from flask import render_template, send_from_directory

app = flask.current_app
bp = flask.Blueprint('index', __name__)


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route("/static/<path:path>")
def static(path):
    return send_from_directory(os.path.join("piracymoe", "static"), path)
