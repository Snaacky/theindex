FROM python:3.9-slim-buster

# install nginx
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y nginx makepasswd wget && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# install needed python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# replace default nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY . /app

ENV AUDIT_WEBHOOK=""
ENV DISCORD_CLIENT_ID=00000000000
ENV DISCORD_CLIENT_SECRET="your_discord_client_secret"
ENV DISCORD_REDIRECT_URI="https://piracy.moe/user/callback/"
ENV DISCORD_BOT_TOKEN="your_discord_bot_token"
ENV OAUTHLIB_INSECURE_TRANSPORT="0" 
# OAUTHLIB_INSECURE_TRANSPORT: 1 for debugging, 0 for production

VOLUME ["/config"]
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1

LABEL org.opencontainers.image.vendor="/r/animepiracy" \
      org.opencontainers.image.url="https://piracy.moe" \
      org.opencontainers.image.description="Webserver of piracy.moe Index" \
      org.opencontainers.image.title="Index" \
      maintainer="Community of /r/animepiracy"

# sed is for replacing windows newline
CMD sed -i 's/\r$//' start.sh && sh start.sh
