import json
import logging
import os

from flask import redirect, jsonify, request, Blueprint, current_app
from flask_discord import requires_authorization, Unauthorized

bp = Blueprint('user', __name__)


@bp.route("/user/is-login")
def is_login():
    if current_app.discord.authorized:
        return jsonify({"edit": True})
    return jsonify({"edit": False})


@bp.route("/user/login/")
def login():
    if current_app.discord.authorized:
        return redirect(request.host_url)
    return current_app.discord.create_session(scope=["identify"])


@bp.route("/user/logout/")
@requires_authorization
def logout():
    user = current_app.discord.fetch_user()
    logging.info(f"User {user} logged out")
    current_app.discord.revoke()
    return redirect(request.host_url)


@bp.route("/user/callback/")
def callback():
    current_app.discord.callback()
    user = current_app.discord.fetch_user()
    with open(os.path.join("/config", "whitelist.json")) as f:
        whitelist = json.load(f)
        if user.id not in whitelist:
            current_app.discord.revoke()
            return redirect(request.host_url + "user/logout/")
        logging.info(f"User {user} logged in")
        return redirect(request.host_url)


@current_app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(request.host_url + "user/login/")
