[![Website](https://img.shields.io/website?down_message=offline&label=theindex.moe&up_message=online&url=https%3A%2F%2Ftheindex.moe)](https://theindex.moe)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/theindexmoe/index/Docker?logo=github)](https://github.com/theindexmoe/index)
[![CodeFactor](https://www.codefactor.io/repository/github/theindexmoe/index/badge)](https://www.codefactor.io/repository/github/theindexmoe/index)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/841b254fc40146108ca99d32ce833199)](https://www.codacy.com/gh/theindexmoe/index/dashboard)
[![Discord](https://img.shields.io/discord/974468300304171038?label=Discord&logo=discord)](https://discord.gg/theindex)

# TheIndex

The frontend, editor panel, and API of the TheIndex.

## Getting started

The easiest way is to get started is by using Docker Compose. You need to copy
the [`docker-compose.yml`](docker-compose.yml) and [`example.env`](example.env) file from GitHub. Rename `example.env`
to `.env` and adjust the environment variables as you need to. with the following command:

```shell
docker-compose up -d
```

You'll need to change `<host-port>` to your port of choice. The web-server is not secured via SSL/TLS, it is in your
responsibility to put a reverse proxy in front of this container. When you run the image for the first time, don't
forget to set your own [discord-id](https://discord.com/developers/docs/resources/user) in the
env `SETUP_WHITELIST_DISCORD_ID` to be able to login and edit. Once your container has set up itself once, you can
remove the env variable from your setup.

## Database

We use [mongodb](https://github.com/mongodb/mongo) as our database server. You can deploy your own mongo setup as HA
service or just a simple single docker container via e.g.:

> Note: The database will start empty, you have to fill the data yourself.

```shell
docker run -d \
    --name mongo \
    -v ./db:/data/db \
    mongo
```

For development or testing purposes it is highly recommended to
use [mongo-express](https://github.com/mongo-express/mongo-express) for accessing, viewing and editing the current state
of the database. If you make it publicly accessible, **don't forget** to secure it with _login credentials_.

To simply spin up a mongo-express docker container, run:

```shell
docker run -d \
    --name mongo-express \
    -p 8081:8081 \
    mongo-express
```

You can also take a look at our provided [`docker-compose`](docker-compose.yml) file on how to set it up.

## Cache-DB

To increase performance we use [redis](https://redis.io/) to cache results from the mongoDB. The cache is being
autopopulated on cache-misses.

You can create a new instance with docker by running:

```shell
docker run -d \
    --name redis \
    redis
```

The redis db is already included in the example [`docker-compose`](docker-compose.yml) file

## Updating container image

Warning: be aware, that we do not offer any kind of official support and every update may be with breaking changes. Be
sure to make backups before you update

To get the newest version of the container image
from [Docker Hub](https://hub.docker.com/repository/docker/theindexmoe/index), you will need to run:

```shell
docker pull theindexmoe/index
```

Afterwards, you will need to stop and remove your current running instance and start it again.

## Parameters

Here is a collection of the possible environment variables with their default values you should set in your `.env` file:

| Parameter                    | Function                                                                                             | Default                              |
|------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------|
| `NEXT_PUBLIC_SITE_NAME`      | The name of your site                                                                                | `"The Index"`                  |
| `NEXT_PUBLIC_DOMAIN`         | Your domain or IP, remove trailing slash                                                             | `"https://theindex.moe"`               |
| `NEXTAUTH_URL`               | Your domain or IP, remove trailing slash                                                             | `$NEXT_PUBLIC_DOMAIN`                |
| `DATABASE_URL`               | Take a look at [mongodb docs](https://docs.mongodb.com/manual/reference/connection-string/)          | `"mongodb://mongo:27017/index"`      |
| `CACHE_URL`                  | Connection string for the redis cache database                                                       | `"redis://redis:6379"`               |
| `CHROME_URL`                 | WebSocket URL to a running chrome instance                                                           | `"ws://chrome:3300"`                 |
| `AUDIT_WEBHOOK`              | WebHook-URL for audit-log, leave empty to disable support                                            | `""`                                 |
| `SOCKS_PROXY`                | Address for SOCKS5 proxy to use for pinging                                                          | `""`                                 |
| `SOCKS_PORT`                 | Port for SOCKS5 connection                                                                           | `""`                                 |
| `SOCKS_USER`                 | User for SOCKS5 connection                                                                           | `""`                                 |
| `SOCKS_PASS`                 | Password for SOCKS5 connection                                                                       | `""`                                 |
| `DISCORD_CLIENT_ID`          | Discord OAuth2 client ID                                                                             | `"your_discord_oauth_client_id"`     |
| `DISCORD_CLIENT_SECRET`      | Discord OAuth2 client secret                                                                         | `"your_discord_oauth_client_secret"` |
| `DISCORD_BOT_TOKEN`          | Required to access BOT resources                                                                     | `"your_discord_bot_token"`           |
| `SETUP_WHITELIST_DISCORD_ID` | If you need help getting your id, check out this [guide](https://wiki.discord.id/obtain-ids/desktop) | `"your_discord_id"`                  |

And the following env variables are only needed when you are in dev mode and debugging the db

| Parameter                      | Function                                                                 | Default        |
| ------------------------------ | ------------------------------------------------------------------------ | -------------- |
| `ME_CONFIG_BASICAUTH_USERNAME` | [mongo-express](https://github.com/mongo-express/mongo-express) username | "admin"        |
| `ME_CONFIG_BASICAUTH_PASSWORD` | [mongo-express](https://github.com/mongo-express/mongo-express) password | "SUPER_SECRET" |

If you want to verify how the docker-compose file fills the envs in, use `docker-compose config`

## Getting started to code

### Setup around the web app

1. Getting started isn't that straight forward. You will need to have installed the latest version
   of [docker with docker-compose](https://docs.docker.com/get-docker/) on your machine.

2. Start by cloning the repo via a graphical git client (highly recommended) or use the cli via

```shell
git clone https://github.com/theindexmoe/index
```

3. Copy the [`example.env`](example.env) file to `.env`.

### How to fill the .env

- Replace `NEXT_PUBLIC_DOMAIN` and `NEXTAUTH_URL` with `http://localhost:3000`
- Generate a random strong string of at least 32 characters and use it for `NEXTAUTH_SECRET`. You can use generators
  e.g. [1Password](https://1password.com/password-generator/) or create it yourself.
- Change `DATABASE_URL`, `CACHE_URL` and `CHROME_URL` to use localhost instead of `mongo`, `redis` and `chrome` for
  example: `mongodb://mongo:27017` -> becomes `mongodb://localhost:27017`
- Go to `https://discord.com/developers` -> Create a new Application -> Go into `Auth2` inside your Application panel ->
  Copy the `CLIENT ID` and `CLIENT SECRET` into the `.env` file.
- In `Redirects` in `Auth2` copy and paste the following URL needed to verify your Discord
  login `http://localhost:3000/api/auth/callback/discord`.
- Fill `SETUP_WHITELIST_DISCORD_ID` with your Discord ID to have an admin account when you login.
- Generate again another random strong string of at least 32 characters and use it for `MEILI_MASTER_KEY`. You can use
  generators e.g. [1Password](https://1password.com/password-generator/) or create it yourself.
- Lastly if you want to change the password for mongo-express, you can do so with the last two variables, usually though
  none of us do while developing locally.

4. Add the following ports to the images in the [`docker-compose`](docker-compose.yml) file:

| service  | port-mapping  |
| :------- | ------------- |
| `mongo`  | `27017:27017` |
| `redis`  | `6379:6379`   |
| `meili`  | `7700:7700`   |
| `chrome` | `3300:3000`   |

As an example, the setup for `mongo` should look similar to this:

```yml
mongo:
  image: mongo
  container_name: index-db
  restart: unless-stopped
  ports:
    - '27017:27017'
  volumes:
    - ./db:/data/db
```

5. Now run the command to start all the needed backend processes

```shell
docker-compose up -d mongo redis meili chrome mongo-express
```

Alternatively you can also just comment or remove the index service and run the command

```shell
docker-compose up -d
```

### Web service

To start coding on the frontend, you will need to make sure, you have the latest version of
[node.js](https://nodejs.org/) correctly installed. To install all the required dependencies run once:

```shell
npm install
```

> Note: We decided to stick with npm instead of yarn to manage dependencies.

You should now have a folder called `node_modules`, which contains all the dependencies we need. We use
[Next.js](https://nextjs.org) as framework for our [React](https://reactjs.org) web service. To test the web service you
will have to run a db server in the background and start the frontend via:

```shell
npm run dev
```

After compiling you can open [http://localhost:3000](http://localhost:3000) in your browser of choice and see the
running web application.

As we use [Next.js](https://nextjs.org), the frontend supports hot reloading, so you can just leave the page open, while
you modify the code and see the changes on the fly in your browser.

### Docker image

To create a ready-made docker image, just run:

```shell
docker build . -t index
```

You now have a local image with tag `index` that contains a distributable version of the code which can now be run.

### Auto-formatter

We use [prettier](https://prettier.io) to ensure a consistent code style across all participants. You can simply
auto-format everything with e.g. running the command

```shell
npx prettier --write .
```

## Design of the web app

### ISR/SSR

Where possible we use [ISR](https://vercel.com/docs/next.js/incremental-static-regeneration) to pre generate all
publicly accessible pages for caching by CDNs or proxies while validating and fetching new data
with [SWR](https://web.dev/stale-while-revalidate/) requesting our own api.

### API

We serve every api request over the endpoint `/api`, the corresponding code can be viewed at [pages/api](pages/api).

- `/api/auth` is reserved for [NextAuth.js](https://next-auth.js.org/).
- `/api/edit/...` requires a logged-in user and usually (at least) editor rights and is for modifying or creating new
  content. The `_id` keyword `_new` is reserved for creating new content.
- `/api/delete/...` requires a logged-in user and usually (at least) editor rights and is for deleting content.
- `/api/[content]s` are public endpoints for fetching a list of all items of a certain content.
- `/api/[content]/...` are public endpoints for fetching information about a specific content.

### Page restrictions

Every page request first has to go through [\_app.ts](pages/_app.ts), where a basic layout is being applied and if a
page has an `auth` property, it also validates whether the user can access the given page. Valid auth attributes are:

- `auth` itself is `null` or `typeof auth === "undefined"`, no restrictions. This seems to be a public page.
- `requireLogin`, not really needed, but set it for logic reasons. User must be logged-in.
- `requireAdmin`, only a user with admin rights can access this page.
- `requireEditor`, only editors can view this page.

## Contribution

Pull-requests are always welcome, but may not be always merged as it has to be in align with our idea of the index. If
you want a certain feature or have an idea, you can always open a feature request
in [Issues](https://github.com/theindexmoe/index/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEAT%5D)
or report it on our [Discord](https://discord.gg/theindexmoe) in `#index` to be discussed. If it is not bad, in align with
our ideas, and we find some time, we will certainly implement your requested feature (sometime...).

### Things we use

- [next.js](https://nextjs.org/) as Webserver
- [React](https://reactjs.org/) as JS framework
- Styles from [bootstrap](https://getbootstrap.com/)
- Icons from [Font Awesome](https://fontawesome.com)
- We bake everything into a [docker image](https://www.docker.com/)
- Running on [node js](https://nodejs.org/)
- User-authentication via [NextAuth.js](https://next-auth.js.org/)
- PWA-support with [next-pwa](https://www.npmjs.com/package/next-pwa)
- [mongodb](https://www.mongodb.com) as database backend
- [redis](https://redis.io) as cache
- [puppeteer](https://github.com/puppeteer/puppeteer) to create screenshots of websites
- [browserless/chrome](https://github.com/browserless/chrome) to run our chrome instance
- [react-in-viewport](https://github.com/roderickhsiao/react-in-viewport) for checking if components are visible or not
- [react-draggable](https://github.com/react-grid-layout/react-draggable) for dragging components by the end user
- [react-toastify](https://github.com/fkhadra/react-toastify) for handling notifications
- [iso-639-3](https://www.npmjs.com/package/iso-639-3) for the languages

And most importantly:

> The help of our awesome community :3

### Technical debts

- We use JS instead of TS (currently in migration)
- Unify `Editor`-views
- Unify db insert and updates to the format of `func(_id, dataObject)` and update only as needed, GraphQL would be
  nice...
- Move to `add`, `remove` api instead of having to send whole arrays to update lists -> GraphQL?
