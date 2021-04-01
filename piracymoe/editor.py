import flask

from flask import redirect, url_for, jsonify
from flask_discord import requires_authorization, Unauthorized

app = flask.current_app
bp = flask.Blueprint('editor', __name__)


@bp.route("/user/is-login/")
def is_login():
    if app.discord.authorized:
        return jsonify({"edit": True})
    return jsonify({"edit": False})


@bp.route("/user/login/")
def login():
    if app.discord.authorized:
        return redirect(url_for("editor.login"))
    return app.discord.create_session(scope=["identify"])


@bp.route("/user/logout/")
@requires_authorization
def logout():
    app.discord.revoke()
    return redirect("/")


@bp.route("/user/callback/")
def callback():
    app.discord.callback()
    user = app.discord.fetch_user()
    if user.id not in app.config["WHITELISTED_USERS"]:
        app.discord.revoke()
        return redirect(url_for("editor.logout"))
    return redirect("/")


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(url_for("editor.login"))
