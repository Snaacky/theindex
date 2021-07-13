# ------------------------------------------------------------------------------
# React Build Stage
# ------------------------------------------------------------------------------
FROM node:16.3.0-slim as react-build

ENV AUDIT_WEBHOOK=""
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="secret"
ENV ROOT_URL="https://piracy.moe"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"
ENV DATABASE_URL="mongodb://mongo:27017"

VOLUME ["/data/db"]
EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

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
