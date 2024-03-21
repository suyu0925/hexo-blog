---
title: OpenClash中的DNS设置
date: 2024-03-21 16:17:14
tags:
  - openwrt
description: OpenClash默认的DNS设置其实并不合理，本文介绍一下我的DNS设置。
---

## DNS 设置

官方的[DNS 设置](https://github.com/vernesong/OpenClash/wiki/DNS%E8%AE%BE%E7%BD%AE)文档比较老了，很久没更新，用的配图还是很老的版本。

我们直接从 DNS 设置页面开始。

{% asset_img "custom-upstream.png" "自定义上游DNS服务器" %}

初始默认设置下，OpenClash 不使用`自定义上游DNS服务器`，此时使用的是上游的 DNS，通常来自于运营商，有很大可能被污染。

## 三个分组

OpenClash 的 DNS 设置分为三个分组：

- NameServer
- FallBack
- Default-NameServer

{% asset_img "groups.png" "三个服务器分组" %}

给一个 FakeIP 的例子：

```yaml
dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  listen: 0.0.0.0:7874
  nameserver:
    - dhcp://"eth1"
    - 192.168.1.1
    - 114.114.114.114
    - 119.29.29.29
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  default-nameserver:
    - 114.114.114.114
    - 119.29.29.29
    - 223.5.5.5
    - 192.168.1.1
```

可以看到里面的 DNS 服务地址有三种样式，分别是：

- Do53: 192.168.1.1
- DoT: dhcp://"eth1"
- DoH: https://doh.pub/dns-query

Do53就是我们认识中传统的DNS，基于UDP/TCP。
后面两个则是2016年后出现的加密DNS协议，其中DoT是DNS over TLS，DOH则是DNS over HTTPS。
可以参考[这篇文章](https://www.whalebone.io/post/doh-and-dot-encrypted-dns-demystified)和[这篇](https://www.sainnhe.dev/post/best-practice-for-dns-in-clash/#%E5%9F%BA%E7%A1%80)。

先说 `default-nameserver`，它的功能最单一，它是用来解析 `nameserver` 的 DNS 服务，所以它不允许使用域名，只能用Do53协议。

`nameserver`则是我们使用的dns服务，当openclash收到dns解析请求时，它会并行的向所有的服务发起请求，然后采用最快返回的结果。

如果所有的请求都失败，那么就会使用`fallback`中的dns服务。
