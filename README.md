# piracy.moe index

This repository is the web-ui of /r/animepiracy index.

If you want to just report missing or false data, please go over to our [Discord](https://discord.gg/piracy) and report
it in `#index`.

# Getting started

The easiest way is to use docker via:

```
docker run -d -p <host-port>:8080 ranimepiracy/index
```

You'll need to change `<host-port>` to your port of choice. The web-server is not secured via SSL/TLS, it is in your
responsibility to put a reverse proxy in front of this container.

Alternatively you can use Github's package repository and instead use:

```
docker run -d -p <host-port>:8080 docker.pkg.github.com/ranimepiracy/index/index-web
```

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
