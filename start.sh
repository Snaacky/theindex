#!/usr/bin/env bash
service nginx restart

# migrate if db does not exists
if [ ! -f /config/data.db ]; then
    echo "Could not find existing db, trying to run migration script"
    python migrate.py
fi
flask_secret=$(makepasswd)
echo "Generated new flask_secret: ${flask_secret}"
echo "${flask_secret}" > /srv/.flask_secret

# start the web api
gunicorn --workers 3 -b unix:/tmp/gunicorn.sock 'app:create_app()'