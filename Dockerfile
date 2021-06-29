# ------------------------------------------------------------------------------
# React Build Stage
# ------------------------------------------------------------------------------
FROM node:16.3.0-slim as react-build

ENV AUDIT_WEBHOOK=""
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="your_discord_client_secret"
ENV DISCORD_REDIRECT_URI="https://piracy.moe/user/callback/"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"
# refer to https://docs.mongodb.com/manual/reference/connection-string/
ENV DB_CONNECTION_URI="mongodb:///mongo:27017"

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
RUN npm run build

# sed is for replacing windows newline
# CMD sed -i 's/\r$//' start.sh && sh start.sh

# start the node server
CMD npm run start
