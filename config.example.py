# provide a random string as secret to enforce consistent sessions even after an restart
SECRET_KEY = "random_key_for_flask"

# well.. for what to we need those exactly?
DISCORD_CLIENT_ID = "your_discord_client_id"
DISCORD_CLIENT_SECRET = "your_discord_client_secret"
# is this really necessary? we could hardcode this with something like https://{http_servername}/callback
DISCORD_REDIRECT_URI = "http://localhost:5000/callback"

# discord api access for OAuth2
DISCORD_BOT_TOKEN = "your_discord_bot_token"

# allowed discord-users
WHITELISTED_USERS = [00000000000, 0000000000, 00000000]
