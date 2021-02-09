FROM nginx:alpine

EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1

# install python and uswgi
RUN apk add --no-cache \
    python3 \
    py-pip \
    redis

# replace default nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# install needed python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY . /app


CMD redis-server --daemonize yes && gunicorn --workers=2 'app:create_app()'