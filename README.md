[![Website](https://img.shields.io/website?down_message=offline&label=piracy.moe&up_message=online&url=https%3A%2F%2Fpiracy.moe)](https://piracy.moe)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ranimepiracy/index/Docker?logo=github)](https://github.com/ranimepiracy/index)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/ranimepiracy/index/latest?logo=docker)](https://hub.docker.com/r/ranimepiracy/index)
[![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/animepiracy?label=%2Fr%2Fanimepiracy&logo=reddit)](https://www.reddit.com/r/animepiracy)
[![Twitter Follow](https://img.shields.io/twitter/follow/ranimepiracy?label=%40ranimepiracy&logo=twitter&style=flat)](https://twitter.com/ranimepiracy)
[![Discord](https://img.shields.io/discord/622243127435984927?label=Discord&logo=discord)](https://discord.gg/piracy)

# piracy.moe index
This repository is the web-ui of /r/animepiracy index.

If you want to just report missing or false data, please go over to our [Discord](https://discord.gg/piracy) and report
it in `#index`.

# Getting started
The easiest way is to use docker via:
```
docker run -d -p <host-port>:8080 -v /path/on/host:/config:ro ranimepiracy/index
```

You'll need to change `<host-port>` to your port of choice. The web-server is not secured via SSL/TLS, it is in your
responsibility to put a reverse proxy in front of this container.

Alternatively you can use Github's package repository and instead use:

```
docker run -d -p <host-port>:8080 -v /path/on/host:/config:ro docker.pkg.github.com/ranimepiracy/index/index-web
```

## Config
You will need to provide a `config.py` file in `/config` and if you want to have an editor, you need to provide your own
source of files in `/config`. This can be easily done by including the folder of [DataTables-Editor](https://editor.datatables.net).
It has to have to be renamed `/config/editor/` and it is expected to contain the `/config/editor/css/` and `/config/editor/js/`
folders with their respective files in it.

## Building from source
To build the [docker image](https://docs.docker.com/engine/reference/commandline/build/) you will need to run:
```
docker build . -t index-web
```
Afterwards you will just need to run
```
docker run -d -p <host-port>:8080 index-web
```
You can than open http://localhost:8080 in your browser.

# Contribution
Pull-requests are always welcome, but may not be always merged as it has to be in align with our idea of the index. If
you want a certain feature or have an idea, you can always open a feature request
in [Issues](https://github.com/ranimepiracy/index/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEAT%5D)
or report it on our [Discord](https://discord.gg/piracy) in `#index` to be discussed. If it is not bad, in align with
our ideas, and we find some time, we will certainly implement your requested feature (sometime...).
