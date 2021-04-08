import logging
import os
import sys
import json

from flask import Flask
from flask_discord import DiscordOAuth2Session

# can this be removed? TODO: test it
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # ONLY FOR DEBUGGING!

# warn if no audit webhook has been found
if os.environ.get('AUDIT_WEBHOOK') == "":
    logging.warn("WARNING: No webhook for audit-log found")

# create whitelist.json if not exists
if not os.path.isfile("/config/whitelist.json"):
    logging.warn("No whitelist file found in /config/whitelist.json, creating new")
    with open("/config/whitelist.json", "w") as f:
        json.dump([9999999999], f)

def create_app():
    app = Flask(__name__)

    # setting flask_secret
    with open(os.path.join("/srv", ".flask_secret"), "rb") as secret:
        app.secret_key = secret.read()

    # discord oauth-2 config
    app.config["DISCORD_CLIENT_ID"] = os.environ.get("DISCORD_CLIENT_ID")
    app.config["DISCORD_CLIENT_SECRET"] = os.environ.get("DISCORD_CLIENT_SECRET")
    app.config["DISCORD_REDIRECT_URI"] = os.environ.get("DISCORD_REDIRECT_URI")
    app.config["DISCORD_BOT_TOKEN"] = os.environ.get("DISCORD_BOT_TOKEN")

    with app.app_context():
        from piracymoe import api
        app.register_blueprint(api.bp)
        from piracymoe import editor
        app.register_blueprint(editor.bp)

        app.discord = DiscordOAuth2Session(app)

    return app
