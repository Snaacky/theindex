FROM node:16.13.0-slim

# We use the image browserless/chrome instead of having our own chrome instance here
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# browserless/chrome runs by our default on port 3300
ENV CHROME_URL="ws://chrome:3300"

# Site name
ENV NEXT_PUBLIC_SITE_NAME="The Anime Index"

# connection urls
ENV NEXTAUTH_URL="https://piracy.moe"
ENV NEXT_PUBLIC_DOMAIN="https://piracy.moe"
ENV DATABASE_URL="mongodb://mongo:27017"
ENV CACHE_URL="redis://redis:6379"
ENV AUDIT_WEBHOOK=""

# ENV for OAuth2
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="secret"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"

# Setup login whitelist
ENV SETUP_WHITELIST_DISCORD_ID=00000000000

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

# we want curl for the healthcheck
RUN apt update -y && \
    apt install --no-install-recommends -y curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    npm ci --silent

# build the web app
COPY . .

# start the node server
CMD npm run serve
