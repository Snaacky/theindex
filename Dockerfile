# Install dependencies only when needed
FROM oven/bun:1.1.17-alpine AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:22.3 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
ENV PATH /app/node_modules/.bin:$PATH

# We use the image browserless/chrome instead of having our own chrome instance here
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# browserless/chrome runs by default on port 3300
ENV CHROME_URL="ws://chrome:3000"

# Site name
ENV NEXT_PUBLIC_SITE_NAME="The Anime Index"

# connection urls
ENV NEXTAUTH_URL="https://theindex.moe"
ENV NEXT_PUBLIC_DOMAIN="https://theindex.moe"
ENV DATABASE_URL="mongodb://mongo:27017/index"
ENV CACHE_URL="redis://redis:6379"
ENV AUDIT_WEBHOOK=""

# ENV for OAuth2
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="secret"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"

# Setup login whitelist
ENV SETUP_WHITELIST_DISCORD_ID=00000000000

# Set to true if you want debug for the pings
ENV PING_DEBUG="false"

EXPOSE 3033
HEALTHCHECK CMD curl --fail http://localhost:3033 || exit 1

LABEL org.opencontainers.image.vendor="TheIndex" \
    org.opencontainers.image.url="https://theindex.moe" \
    org.opencontainers.image.description="Webserver of TheIndex" \
    org.opencontainers.image.title="TheIndex" \
    maintainer="Community of TheIndex"


# we want curl for the healthcheck
RUN apt update -y && \
    apt install --no-install-recommends -y curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    npm install @next/swc-linux-x64-gnu

# build the web app
COPY . .

# start the node server
CMD npm run serve
