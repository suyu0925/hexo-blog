---
title: elasticsearch在docker中的堆内存大小设置
date: 2021-12-21 11:19:59
tags: [docker, elasticsearch]
description: 在使用docker运行elasticsearch时，发现内存高达占用13G，研究一下它的内存设定
---
首先查找[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-set-heap-size)，es默认的jvm堆内存大小是docker容器分配内存的一半。

在我机器上docker容器使用的内存上限是24.99G，es当仁不让的用掉了一半，再加上其它内存使用，便高达13G。

查看内存设置
```bash
$> docker stats
CONTAINER ID   NAME                                CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O   PIDS
daf5ca2e87dc   elasticsearch                       0.79%     13.33GiB / 24.99GiB   3.31%     45.2MB / 281kB    0B / 0B     88
```

要修改它有三个方法：

1. 设置docker容器内存上限
```powershell
docker run `
  -d `
  --name elasticsearch `
  -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 `
  --memory="1g" `
  --memory-swap="1g" `
  -e "discovery.type=single-node" `
  docker.elastic.co/elasticsearch/elasticsearch:7.16.2
```

2. 使用环境变量

这种方式会覆盖掉JVM Options，不建议使用在发布环境下。

```bash
docker run \
  -d \
  --name elasticsearch \
  -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 \
  -e "discovery.type=single-node" \
  -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" \
  docker.elastic.co/elasticsearch/elasticsearch:7.16.2
```

3. 使用jvm.options.d

在容器中放一个`jvm.options`设置文件在`/usr/share/elasticsearch/config/jvm.options.d`目录，设置
```cnf
-Xms1g
-Xmx1g
```
来控制内存。

但elasticsearch的docker image没有使用服务，而是在启动时就直接运行bin/elasticsearch，所以无法重启服务让新设置生效和，需要bind mount `jvm.options.d`创建新容器来达成目的。

```powershell
docker run `
  -d `
  --name elasticsearch `
  -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 `
  --mount type=bind,source=$PWD/jvm.options.d,target=/usr/share/elasticsearch/config/jvm.options.d `
  -e "discovery.type=single-node" `
  docker.elastic.co/elasticsearch/elasticsearch:7.16.2
```

**注意**
如果host的`./jvm.options`不存在，docker会创建一个名为`jvm.options`的空目录，并不会运行报错。
