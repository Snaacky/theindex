#!/usr/bin/env bash
service nginx restart

# generate a new one time flask_secret
if [ ! -f /srv/.flask_secret ]; then
    flask_secret=$(makepasswd)
    echo "Generated new flask_secret: ${flask_secret}"
    echo "${flask_secret}" > /srv/.flask_secret
fi

# replace sponsoredAnime with dynamic string
sponsored_anime=$(makepasswd --minchars=5 --maxchars=20 --string="abcdefghijklmnopqrstuvwxyz")
sed -i "s/sponsoredAnime/${sponsored_anime}/g" /app/static/js/sponsored.js
sed -i "s/sponsoredAnime/${sponsored_anime}/g" /app/index.html

mkdir -p /config
cd /app/api || return

# migrate if db does not exists
if [ ! -f /config/data.db ]; then
    echo "Could not find existing db, trying to run migration script"
    python init.py
fi

# start the web api
gunicorn --workers 3 -b unix:/tmp/gunicorn.sock 'app:create_app()'