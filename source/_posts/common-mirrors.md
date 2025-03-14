---
title: 常用开源镜像站
date: 2022-01-18 16:24:13
tags: 
description: 大部分开发软件生态都是起源于国外，在安装包时经常会遇上墙，虽然能翻墙，但还是直连国内比较爽对么
---
商业巨头们
- [阿里](https://developer.aliyun.com/mirror/)
- [腾讯](https://mirrors.cloud.tencent.com/)
- [华为](https://mirrors.huaweicloud.com/)
- [网易](https://mirrors.163.com/)

再来点教育网的
- [清华](https://mirrors.tuna.tsinghua.edu.cn/)
- [上交大](https://mirrors.sjtug.sjtu.edu.cn/)
- [北交大](https://mirror.bjtu.edu.cn/)
- [浙大](http://mirrors.zju.edu.cn/)
- [中科大](https://mirrors.ustc.edu.cn/)
- [哈工大](http://mirrors.hit.edu.cn/)
- [兰大](http://mirror.lzu.edu.cn/)

这些镜像站通常在提供镜像的同时还会提供用法，比如：
- [pypi](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)
- [npm](http://www.npmmirror.com/)
- [debian](https://mirrors.ustc.edu.cn/help/debian.html)
- [maven](https://mirrors.163.com/.help/maven.html)
- [rustup](https://mirrors.tuna.tsinghua.edu.cn/help/rustup/)
- [crates.io-index.git](https://mirrors.tuna.tsinghua.edu.cn/help/crates.io-index.git/)
- [docker hub](https://help.aliyun.com/document_detail/60750.html)

阿里的镜像已经被列入黑名单，竟然限速至200KB/s，本来是为了加速，使用镜像后反倒变龟速。

更推荐几个头部大学的镜像站，比如清华、浙大、中科大。速度快，同步频率也比商业巨头高。

## github

国内有一个[ghproxy](https://ghproxy.com/)提供了github的镜像源，在git clone时，只要使用`git clone https://ghproxy.com/https://github.com/stilleshan/ServerStatus`，即在正常的github链接前面加上`https://ghproxy.com/`即可实现镜像。

如果想润物细无声，可以修改git设置：
```bash
git config --global url."https://ghproxy.com/https://github.com".insteadOf "https://github.com"
```
这样对使用来说就比较无感了，但会影响`git push`，不建议使用。

## dockerhub

### 国内源

高校和云服务器的docker源都已经下架，公共镜像站可以参见[DaoCloud](https://www.daocloud.io/)创建的[镜像加速服务状态监控](https://status.daocloud.io/status/docker)。建议使用`https://docker.1ms.run/`。

### 使用方法

修改`daemon.json`，添加以下内容
```json
{
  "registry-mirrors": ["https://<my-docker-mirror-host>"]
}
```
然后重启docker daemon以生效。可参见[官方文档](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

可用`docker info`来查看Registry Mirrors有没有应用成功。

#### linux

具体到[linux上](https://docs.docker.com/engine/install/linux-postinstall/#configuring-remote-access-with-daemonjson)

1. docker是使用apt安装的

此时daemon.json的位置在`/etc/docker/daemon.json`，修改完后可使用
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```
来重启docker.service。

2. docker是使用snap安装的

此时daemon.json的位置在`/var/snap/docker/current/config/daemon.json`，修改完后使用
```bash
snap restart docker
```
来重启docker服务。

#### windows

而[windows上](https://docs.docker.com/desktop/settings/windows/#docker-engine)，daemon.json的位置在`%USERPROFILE%\.docker\daemon.json`，一般直接用Docker Desktop的GUI界面来重启docker daemon。
