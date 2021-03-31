# provide a random string as secret to enforce consistent sessions even after an restart
SECRET_KEY = "random_key_for_flask"

# Discord client ID.
DISCORD_CLIENT_ID = 353828110103478272
# Discord client secret.
DISCORD_CLIENT_SECRET = "your_discord_client_secret"
# URL to your callback endpoint.
DISCORD_REDIRECT_URI = "http://localhost:8080/user/callback"

# Required to access BOT resources.
DISCORD_BOT_TOKEN = "your_discord_bot_token"

# allowed discord-users
WHITELISTED_USERS = [00000000000, 0000000000, 00000000]
