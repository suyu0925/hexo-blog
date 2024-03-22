---
title: "介绍一个新的缓存系统：garnet"
date: 2024-03-22 14:01:23
tags:
  - 善用佳软
description: garnet 是微软基于.NET开发的远程缓存存储系统，兼容redis接口，已于近日开源。
---

[Garnet](https://microsoft.github.io/garnet/)的前身是同样开源的[FASTER](https://microsoft.github.io/FASTER/)，但 FASTER 是本地缓存系统，而社区对远程缓存的需求更大，所以才有了 Garnet。[这里](https://microsoft.github.io/garnet/blog/brief-history)有开发人员对这段历史的介绍。

为了更好的起步，兼容[Redis](https://redis.io/)的[RESP 协议](https://redis.io/docs/reference/protocol-spec/)是很好的选择。Garnet 对 RESP 的兼容已经很不错，可以完全支持.NET 生态的[StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/)。虽然 Garnet 使用 C#语言编写，但性能卓越，[官方测试](https://microsoft.github.io/garnet/docs/benchmarking/results-resp-bench#basic-commands-performance)显示，Garnet 的读写性能大约比 Redis 高出 10 倍。

微软于 3 天前（2024 年 3 月 19 日）首次开源并发布了[v1.0.0](https://github.com/microsoft/garnet/releases/tag/v1.0.0)，[官方 docker 版本](https://microsoft.github.io/garnet/docs/welcome/releases#docker)还未发布，目前可以通过源码[自行编译](https://github.com/microsoft/garnet/blob/main/Dockerfile)。
