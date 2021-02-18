import flask

from flask import render_template, redirect, url_for
from flask_discord import requires_authorization, Unauthorized

app = flask.current_app
bp = flask.Blueprint('editor', __name__)


@bp.route("/editor/")
@requires_authorization
def editor():
    user = app.discord.fetch_user()
    return render_template("editor.html", user=user)


@bp.route("/login/")
def login():
    if app.discord.authorized:
        return redirect(url_for("editor.login"))
    return app.discord.create_session(scope=["identify"])


@bp.route("/logout/")
@requires_authorization
def logout():
    app.discord.revoke()
    return redirect(url_for("index.index"))


@bp.route("/callback/")
def callback():
    app.discord.callback()
    user = app.discord.fetch_user()
    if user.id not in app.config["WHITELISTED_USERS"]:
        app.discord.revoke()
        return redirect(url_for("editor.logout"))
    return redirect(url_for("editor.editor"))


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return render_template("login.html")
