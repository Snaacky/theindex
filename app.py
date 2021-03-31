import logging
import os
import sys

from flask import Flask
from flask_discord import DiscordOAuth2Session

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # ONLY FOR DEBUGGING!


def create_app():
    app = Flask(__name__)

    if os.path.isfile("/config/config.py"):
        app.config.from_pyfile("/config/config.py")
    else:
        logging.error("No config file found in /config/config.py")
        sys.exit(0)

    with app.app_context():
        from piracymoe import api
        app.register_blueprint(api.bp)
        from piracymoe import editor
        app.register_blueprint(editor.bp)

        app.discord = DiscordOAuth2Session(app)

    return app
