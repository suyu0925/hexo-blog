---
title: 在windows上本地安装elasticsearch
date: 2021-12-30 14:44:55
tags: [elasticsearch, windows]
description: 虽然有了docker这个神器，但有时还是不得不安装软件在native上，比如不支持linux containers的阿里云windows server
---
老样子，开篇先放个[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)。

官方在windows下提供了两种安装方式：
- [zip](https://www.elastic.co/guide/en/elasticsearch/reference/current/zip-windows.html)
- [msi](https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-16-3)

msi版本已经废弃，`7.16.3`是最后一个支持的版本。从[7.17.0](https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-17-0)开始就没有msi安装文件。

一路下一步即可，只介绍几个需要注意的地方。

**Network host**

如不填默认绑`127.0.0.1`，如果要开放至外网，这里修要修改，下面会重点介绍。

**license**

*付费是不可能付费的，永远不可能付费的。*选择`basic`吧，默认会是`trial`30天试用。

### 开放至外网

如果需开放至外网，只将`Network host`填为`0.0.0.0`是不行的，同时还需要设置`transport.host`。

es的config目录默认在`%ALLUSERSPROFILE%\Elastic\Elasticsearch\config`，我们需要修改`elasticsearch.yml`。

```yml
network.host: 0.0.0.0
transport.host: localhost
xpack.security.enabled: false
```

[`network.host`](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html#common-network-settings)基本无需赘述。

这里的重点在要指定[`transport.host`](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html#transport-settings)，如不指定，它的值会跟`network.host`一样，而`0.0.0.0`并不是一个合格的值，所以es会启动不了。

同时我们可以把[`xpack.security`](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html#general-security-settings)关掉。
虽然阿里云windows server已经是虚拟机[无法再开启Hyper-V二次虚拟化](https://help.aliyun.com/document_detail/25412.html#title-ers-q4j-1pk)使用linux containers，但它带来的好处是端口防火墙可以完全交给安全组。
毕竟es的使用对象还是服务器，无需开放给公众，所以阿里云的安全组已经足够。
