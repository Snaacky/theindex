from flask import redirect, jsonify, request, Blueprint, current_app
from flask_discord import requires_authorization, Unauthorized

app = current_app
bp = Blueprint('editor', __name__)


@bp.route("/user/is-login")
def is_login():
    if app.discord.authorized:
        return jsonify({"edit": True})
    return jsonify({"edit": False})


@bp.route("/user/login/")
def login():
    if app.discord.authorized:
        return redirect(request.host_url)
    return app.discord.create_session(scope=["identify"])


@bp.route("/user/logout/")
@requires_authorization
def logout():
    app.discord.revoke()
    return redirect(request.host_url)


@bp.route("/user/callback/")
def callback():
    app.discord.callback()
    user = app.discord.fetch_user()
    if user.id not in app.config["WHITELISTED_USERS"]:
        app.discord.revoke()
        return redirect(request.host_url + "user/logout/")
    return redirect(request.host_url)


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(request.host_url + "user/login/")
