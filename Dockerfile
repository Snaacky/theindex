FROM node:18.1.0

# We use the image browserless/chrome instead of having our own chrome instance here
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# browserless/chrome runs by our default on port 3300
ENV CHROME_URL="ws://chrome:3300"

# Site name
ENV NEXT_PUBLIC_SITE_NAME="The Anime Index"

# connection urls
ENV NEXTAUTH_URL="https://theindex.moe"
ENV NEXT_PUBLIC_DOMAIN="https://theindex.moe"
ENV DATABASE_URL="mongodb://mongo:27017/index"
ENV CACHE_URL="redis://redis:6379"
ENV AUDIT_WEBHOOK=""

# SOCKS proxy details to use for ping requests
ENV SOCKS_PROXY=""
ENV SOCKS_PORT=""
ENV SOCKS_USER=""
ENV SOCKS_PASS=""

# ENV for OAuth2
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="secret"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"

# Setup login whitelist
ENV SETUP_WHITELIST_DISCORD_ID=00000000000

EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

LABEL org.opencontainers.image.vendor="TheIndex" \
      org.opencontainers.image.url="https://theindex.moe" \
      org.opencontainers.image.description="Webserver of TheIndex" \
      org.opencontainers.image.title="TheIndex" \
      maintainer="Community of TheIndex"

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
    npm ci && \
    npm install @next/swc-linux-x64-gnu

# build the web app
COPY . .

# start the node server
CMD npm run serve
