# ------------------------------------------------------------------------------
# React Build Stage
# ------------------------------------------------------------------------------
FROM node:16.3.0-slim as react-build

ENV AUDIT_WEBHOOK=""
ENV OAUTH2_TOKEN_ENDPOINT="https://discord.com/api/oauth2/token"
ENV OAUTH2_USER_ENDPOINT="https://discord.com/api/users/@me"
ENV OAUTH2_CLIENT_ID=00000000000
ENV OAUTH2_CLIENT_SECRET="secret"
ENV ROOT_URL="https://piracy.moe"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"
ENV DB_CONNECTION_URI="mongodb://mongo:27017"

VOLUME ["/data/db"]
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1

LABEL org.opencontainers.image.vendor="/r/animepiracy" \
      org.opencontainers.image.url="https://piracy.moe" \
      org.opencontainers.image.description="Webserver of piracy.moe Index" \
      org.opencontainers.image.title="Index" \
      maintainer="Community of /r/animepiracy"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install the dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci --silent

# build the web app
COPY . .

# start the node server
CMD npm run serve
