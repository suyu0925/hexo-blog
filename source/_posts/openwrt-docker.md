---
title: "[Openwrt]使用docker"
date: 2022-07-25 15:27:38
tags:
- openwrt
description: 如果不是特别的性能敏感，应该没有什么能比用docker安装软件更方便的了。
---
## 安装

```bash
opkg install dockerd
opkg install luci-app-dockerman
reboot
```

安装完后需要重启一次，docker0 bridge interface才会生效。

## 硬盘

docker使用的目录为`/opt/docker`，所以我们在安装docker前，需要准确一个足够剩余空间的`/opt`，docker的镜像文件还是蛮占空间的。

## 以jellyfin为例

我们试着[在docker中安装jellyfin](https://jellyfin.org/docs/general/administration/installing.html#container-images)。

1. 下载镜像文件

```bash
docker pull jellyfin/jellyfin
```

如果官方源连接失败，我们可以切换到国内源
```bash
$> docker pull jellyfin/jellyfin
Using default tag: latest
Error response from daemon: Get "https://registry-1.docker.io/v2/": net/http: TLS handshake timeout
```

修改`/etc/config/dockerd`
```config
# The following settings require a restart of docker to take full effect, A reload will only have partial or no effect:
# bip
# blocked_interfaces
# extra_iptables_args
# device

config globals 'globals'
#       option alt_config_file '/etc/docker/daemon.json'
        option data_root '/opt/docker/'
        option log_level 'warn'
        option iptables '1'
#       list hosts 'unix:///var/run/docker.sock'
#       option bip '172.18.0.1/24'
#       option fixed_cidr '172.17.0.0/16'
#       option fixed_cidr_v6 'fc00:1::/80'
#       option ipv6 '1'
#       option ip '::ffff:0.0.0.0'
#       list dns '172.17.0.1'
        list registry_mirrors 'https://docker.mirrors.ustc.edu.cn/'    # <-------- 添加国内源
#       list registry_mirrors 'https://hub.docker.com'

# Docker ignores fw3 rules and by default all external source IPs are allowed to connect to the Docker host.
# See https://docs.docker.com/network/iptables/ for more details.
# firewall config changes are only additive i.e firewall will need to be restarted first to clear old changes,
# then docker restarted to load in new changes.
config firewall 'firewall'
        option device 'docker0'
        list blocked_interfaces 'wan'
#       option extra_iptables_args '--match conntrack ! --ctstate RELATED,ESTABLISHED' # allow outbound connections
```

修改完后重启dockerd并验证国内源是否添加成功
```bash
$> service dockerd restart
$> docker info
 ...
 Registry: https://index.docker.io/v1/
 Labels:
 Experimental: false
 Insecure Registries:
  127.0.0.0/8
 Registry Mirrors:
  https://docker.mirrors.ustc.edu.cn/
 Live Restore Enabled: false

WARNING: No swap limit support
```

需要注意的是，使用国内源后，latest版本的更新可能不会那么及时，如果需要使用docker hub上的最新版，还得恢复到官方源，[使用代理](https://docs.docker.com/network/proxy/)来拉取。

2. 创建一个持久化的目录来保存配置和缓存

```bash
mkdir /root/jellyfin/config
mkdir /root/jellyfin/cache
```

或者也可以使用[volume](https://docs.docker.com/storage/volumes/)：
```bash
docker volume create jellyfin-config
docker volume create jellyfin-cache
```

3. 启动

```bash
docker run -d \
 --name jellyfin \
 --user uid:gid \
 --net=host \
 --volume /path/to/config:/config \
 --volume /path/to/cache:/cache \
 --mount type=bind,source=/path/to/media,target=/media \
 --restart=unless-stopped \
 jellyfin/jellyfin
```

注意上面的uid:gid，和三个路径。

如果全部使用默认配置，则可以直接一步到位：

```bash
mkdir -p /root/jellyfin/config
mkdir -p /root/jellyfin/cache
mkdir -p /root/media

docker run -d \
 --name jellyfin \
 --net=host \
 --volume /root/jellyfin/config:/config \
 --volume /root/jellyfin/cache:/cache \
 --mount type=bind,source=/root/media,target=/media \
 --restart=unless-stopped \
 jellyfin/jellyfin
```

4. 控制台

默认端口为8096，直接访问`http://ip-address-of-openwrt:8096`即可访问jellyfin控制台进行初始化设置。

jellyfin中的`/media`为OpenWrt中的`/root/media`。
