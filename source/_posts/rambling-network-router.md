---
title: 路由器漫谈之测试工具
description: 万物互联的时代，接入路由器的设备越来越多。我们经常会察觉到断流，于是怪罪手机。可到底问题出在手机还是路由器还是光猫呢？
date: 2020-09-29 13:59:20
tags:
---
## 网络测试工具

基本可分为三类：WiFi分析，稳定性测试，性能测试。

**WiFi分析**

[acrylicwifi](https://www.acrylicwifi.com/en/)当仁不让的成为WIN上的最佳选择。同样有免费和付费版，我们可以使用免费的[家庭版](https://www.acrylicwifi.com/en/downloads-free-license-wifi-wireless-network-software-tools/download-wifi-scanner-windows/)，也可以试用`sniffer版本`。

**稳定性测试**

长时间的ping，最终看延迟和丢包报告。

[Ping Monitor](https://emcosoftware.com/ping-monitor/download)有免费和付费版，免费版就够用啦。

**性能测试**

性能测试有很多工具，windows上可以用[mikrotik的Bandwidth Test工具](https://mikrotik.com/download)。mikrotik自家出产高端路由器，工具不说好用怎么也是专业的。

注意性能测试需要两台电脑和一台路由器。两台电脑通过路由器组成局域网，然后分别运行客户端和服务端进行带宽测试。

**综合工具**

最后还有一款综合工具推荐：[大名鼎鼎的IxChariot](https://www.keysight.com/hk/en/products/network-test/performance-monitoring/ixchariot.html)，可惜是收费软件，仅可以试用。
