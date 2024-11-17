---
title: "[Openwrt]更新docker compose v2"
date: 2024-11-17 10:45:54
tags:
- openwrt
description: openwrt官方软件源一直是docker-compose v1，我们需要手动更新到v2
---

官方软件源的网址是`https://downloads.openwrt.org/releases/${system_version}/packages/x86_64/packages/Packages`。其中的`${system_version}`是系统版本号，比如[21.02.3](https://downloads.openwrt.org/releases/21.02.3/packages/x86_64/packages/)中使用的`docker-compose`是`docker-compose_1.28.2-1_x86_64.ipk`。

根据docker官方文档升级到v2很简单，只需要使用[Compose plugin的手动安装方式](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually)。

只需下载最新的`docker-compose-linux-x86_64`，重命名为`docker-compose`，放到`$DOCKER_CONFIG/cli-plugins`目录下，并赋予可执行权限。

```sh
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.30.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```
