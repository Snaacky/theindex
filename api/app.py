import json
import logging
import os

from flask import Flask
from flask_discord import DiscordOAuth2Session
from flask_sqlalchemy import SQLAlchemy

# warn if no audit webhook has been found
if os.environ.get('AUDIT_WEBHOOK') == "":
    logging.warning("No webhook for audit-log found")

# create whitelist.json if not exists
if not os.path.isfile("/config/whitelist.json"):
    logging.warning("No whitelist file found in /config/whitelist.json, creating new")
    with open(os.path.join("/config", "whitelist.json"), "w") as f:
        json.dump([9999999999], f)

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # setting flask_secret, on startup it is being generated once in start.sh
    with open(os.path.join("/srv", ".flask_secret"), "rb") as secret:
        app.secret_key = secret.read()

    # discord oauth-2 config
    app.config["DISCORD_CLIENT_ID"] = os.environ.get("DISCORD_CLIENT_ID")
    app.config["DISCORD_CLIENT_SECRET"] = os.environ.get("DISCORD_CLIENT_SECRET")
    app.config["DISCORD_REDIRECT_URI"] = os.environ.get("DISCORD_REDIRECT_URI")
    app.config["DISCORD_BOT_TOKEN"] = os.environ.get("DISCORD_BOT_TOKEN")

    # backend db
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_CONNECTION_URI")

    with app.app_context():
        from queries import bp as queries_bp
        app.register_blueprint(queries_bp)

        from mutations import bp as mutations_bp
        app.register_blueprint(mutations_bp)

        # blueprint for user management
        from user import bp as user_bp
        app.register_blueprint(user_bp)

        app.discord = DiscordOAuth2Session(app)
        db.init_app(app)
        db.create_all()
    return app
