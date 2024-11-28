---
title: 代理池
date: 2024-11-27 15:35:48
tags:
description: 在使用爬虫运行稍微大点的任务时，都可能会撞上IP限流，此时就需要引入代理池。
---

代理可按匿名度分为透明代理、匿名代理和高匿代理。我们需要绕过网站防爬，只能使用高匿代理。

## 自建

如果需要的 IP 数不多，只要极其少量就可以满足需要，才可能自建代理池。

但自建代理池的成本会比直接购买代理服务高很多，所以绝大多数情况下，自建不是一个选项。

## 初体验

先看一下开源项目[proxy_pool](https://github.com/jhao104/proxy_pool)。

只需要修改一下数据库配置就可以运行起来。

它有两个模块：

- schedule: 定时从[免费源](https://github.com/jhao104/proxy_pool#免费代理源)收集代理列表，检测代理的可用性，如果不可用就会删除。
- server: 提供一个 web api，让程序可以获取和修改代理。

因为是免费的代理，所以非常不稳定，可用度大概只有不到 10%。只能用来开发测试，不能用于生产。

类似的开源项目还有一个[ProxyPool](https://github.com/Python3WebSpider/ProxyPool)，工作原理完全一致，星数稍少一点。

## 付费代理

`proxy_pool`的作者推荐[亮数据](https://www.bright.cn/)。

`ProxyPool`的作者推荐[Ace Data Cloud 平台上的服务](https://platform.acedata.cloud/services?page=2)。

知乎上的这篇 2021 年的文章[爬虫代理哪家强？十大付费代理详细对比评测出炉！](https://zhuanlan.zhihu.com/p/33576641)测试了一些国内的付费代理，可以参考。

综合来说，从[Luminati](https://brightdata.com/luminati)发展来的[亮数据](https://brightdata.com/)是质量最高的。

## 亮数据

亮数据提供三种服务：

- 代理和爬虫
- 网络爬虫 api
- 网络数据集

其中，网络爬虫 api 是亮数据内置的一些常见的爬虫任务，比如爬取推特、脸书、Instagram 上面的帖子，网络数据集则是这些常见的爬虫任务的结果。
但很不幸，微博、雪球、微信公众号等国内的网站都不在支持列表里。
所以我们只能选择第一种服务。

代理和爬虫服务同样提供三种模式：

- 云服务器
- 爬虫解决方案
- 代理网络

### 未完待续
