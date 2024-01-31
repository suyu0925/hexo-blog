---
title: 无痕浏览真的无痕吗？
date: 2024-02-01 00:00:41
tags:
description: 当然不是，let's dive in.
---
Chrome的[无痕浏览](https://support.google.com/chrome/answer/7440301?hl=zh-Han)是一种隐私保护的功能，启动无痕浏览后，主要有以下几个特点：
1. 不会保存浏览记录
2. 不会保存在表单中输入的信息
3. 不会读取已保存的cookie
4. 不会保存cookie（使用中的cookie会被保存在内存中，浏览器关闭后会被删除）

但无痕浏览并不是隐身的，网站仍然有很多方法可以识别出用户身份。用户的硬件环境，比如操作系统、浏览器版本、网络环境等，在很长一段时间内都是固定的。

介绍一下[browserleaks](https://browserleaks.com/)，这个网站可以检测你的IP、浏览器指纹等有没有泄漏。

如果是我们自己要识别未登录的用户身份，我们也可以使用开源的[fingerprintjs](https://github.com/fingerprintjs/fingerprintjs)库。但要注意，这个库是非商业许可，如果要用于商业用途，需要购买使用[Fingerprint Identification](https://fingerprint.com/github/)。
