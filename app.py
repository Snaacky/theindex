import os

from flask import Flask, redirect, url_for, send_file, jsonify, render_template
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized

import config

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # ONLY FOR DEBUGGING!

app = Flask(__name__, static_folder="static")

app.secret_key = config.SECRET_KEY

# Discord OAuth2 for editor
app.config["DISCORD_CLIENT_ID"] = config.DISCORD_CLIENT_ID
app.config["DISCORD_CLIENT_SECRET"] = config.DISCORD_CLIENT_SECRET
app.config["DISCORD_REDIRECT_URI"] = config.DISCORD_REDIRECT_URI
app.config["DISCORD_BOT_TOKEN"] = config.DISCORD_BOT_TOKEN
discord = DiscordOAuth2Session(app)


@app.route("/")
def index():
    return send_file(os.path.join("static", "index.html"))


@app.route("/login/")
def login():
    return discord.create_session()


@app.route("/logout/")
def logout():
    discord.revoke()
    return redirect(url_for("index"))


@app.route("/callback/")
def callback():
    discord.callback()
    user = discord.fetch_user()
    if user.id not in config.WHITELISTED_USERS:
        return redirect(url_for(".logout"))
    return redirect(url_for(".editor"))


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(url_for("login"))


@app.route("/editor/")
# @requires_authorization
def editor():
    user = discord.fetch_user()
    return render_template("editor.html", user=user)


# For testing purposes
if __name__ == "__main__":
    app.run(port=8080, debug=True)
