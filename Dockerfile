# ------------------------------------------------------------------------------
# React Build Stage
# ------------------------------------------------------------------------------
FROM node:15.14.0-alpine as react-build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install the dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci --silent && \
    npm install react-scripts@4.0.3 -g --silent

# build the web app
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Final Stage
# ------------------------------------------------------------------------------
FROM python:3.9-slim-buster

ENV AUDIT_WEBHOOK=""
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="your_discord_client_secret"
ENV DISCORD_REDIRECT_URI="https://piracy.moe/user/callback/"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"

VOLUME ["/config"]
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1

LABEL org.opencontainers.image.vendor="/r/animepiracy" \
      org.opencontainers.image.url="https://piracy.moe" \
      org.opencontainers.image.description="Webserver of piracy.moe Index" \
      org.opencontainers.image.title="Index" \
      maintainer="Community of /r/animepiracy"

# copy python requirements beforehand for improved building caching
COPY api/requirements.txt .

# install nginx and needed python packages
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y nginx makepasswd wget && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir -r requirements.txt

# replace default nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# copy build web app
COPY --from=react-build /app/build /usr/share/nginx/html

WORKDIR /app
COPY api .

# sed is for replacing windows newline
CMD sed -i 's/\r$//' start.sh && sh start.sh
