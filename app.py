import logging
import os

from flask import Flask
from flask_discord import DiscordOAuth2Session

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # ONLY FOR DEBUGGING!

def create_app():
    app = Flask(__name__, 
            template_folder=os.path.join("piracymoe", "templates"),
            static_folder=os.path.join("piracymoe", "static")
    )

    app.secret_key = "CHANGE THIS IN PRODUCTION 11111"

    if os.path.isfile("/config/config.py"):
        app.config.from_pyfile("/config/config.py")
    else:
        app.config.from_pyfile("config.py")

    logging.error(app.config)

    with app.app_context():
        from piracymoe.views import editor
        from piracymoe.views import index
        from piracymoe import api
        app.register_blueprint(editor.bp)
        app.register_blueprint(index.bp)
        app.register_blueprint(api.bp)
        app.discord = DiscordOAuth2Session(app)

    return app


# Testing the server without docker
if __name__ == '__main__':
    create_app().run(port=5000, debug=True)
