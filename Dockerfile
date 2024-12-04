FROM node:23.3
WORKDIR /app

# We use the image browserless/chrome instead of having our own chrome instance here
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# browserless/chrome runs by default on port 3300
ENV CHROME_URL="ws://chrome:3000"

# Site name
ENV NEXT_PUBLIC_SITE_NAME="The Anime Index"

# connection urls
ENV NEXTAUTH_URL="https://theindex.moe"
ENV NEXT_PUBLIC_DOMAIN="https://theindex.moe"
ENV AUTH_TRUST_HOST="true"
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

COPY package.json package-lock.json ./
RUN npm ci
ENV PATH /app/node_modules/.bin:$PATH

# manully add .js to import as something is messed up...
RUN sed -i 's/next\/server/next\/server.js/' /app/node_modules/next-auth/lib/env.js \
    && sed -i 's/next\/server/next\/server.js/' /app/node_modules/next-auth/lib/index.js \
    && sed -i 's/next\/headers/next\/headers.js/' /app/node_modules/next-auth/lib/index.js \
    && sed -i 's/next\/headers/next\/headers.js/' /app/node_modules/next-auth/lib/actions.js \
    && sed -i 's/next\/navigation/next\/navigation.js/' /app/node_modules/next-auth/lib/actions.js

# build the web app
COPY . .

# start the node server
CMD npm run serve
