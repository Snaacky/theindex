# piracy.moe index
This repository is the web-ui of /r/animepiracy index.

# Getting started
Easiest way is to use docker via:
```
docker run -d -p <host-port>:80 ranimepiracy/index:master
```
You'll need to change `<host-port>` to your port of choice.
The web-server is not secured via SSL/TLS, it is in your responsibility to put an reverse proxy in front of this container.

# Contribution
If you want to just report missing or false data, please go over to our [Discord](https://discord.gg/piracy) and report it in `#index`.

Want a certain feature or have an idea? Report it to us in `#index` as well or do a proof of concept yourself.
If it is not bad, in align with our ideas and we find some time, we will certainily implement your requested feature.
But you can create a pull request yourself if you want to improve something we messed up or add new features.
