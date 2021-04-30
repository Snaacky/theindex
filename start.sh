#!/usr/bin/env bash
service nginx restart

# migrate if db does not exists
if [ ! -f /config/data.db ]; then
    echo "Could not find existing db, trying to run migration script"
    python migrate.py
fi

# replace sponsoredAnime with dynamic string
sponsored_anime=$(makepasswd --minchars=5 --maxchars=20 --string="abcdefghijklmnopqrstuvwxyz")
sed -i "s/sponsoredAnime/${sponsored_anime}/g" /app/static/js/sponsored.js
sed -i "s/sponsoredAnime/${sponsored_anime}/g" /app/index.html

# start the web api
gunicorn --workers 3 -b unix:/tmp/gunicorn.sock 'app:create_app()'