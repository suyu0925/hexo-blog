---
title: 下载微信旧版本
date: 2025-08-25 18:33:06
tags:
- weixin
description: 有些工具只能工作在微信指定版本上，这里记录一下如何下载老版本。
---
## windows版本

windows客户端下载的官方网页是`https://pc.weixin.qq.com/`。

目前撰稿时，最新版本是`4.1.0.21`。

4.x的多桌面端统一下载链接是：`https://dldir1v6.qq.com/weixin/Universal/Windows/WeChatWin.exe`

3.x的最后一个版本`3.9.12`的x64和x32版本分别是`https://dldir1v6.qq.com/weixin/Windows/WeChatSetup.exe`和`https://dldir1v6.qq.com/weixin/Windows/WeChatSetup_x86.exe`。

### 发布日志

发布日志的网页是`https://weixin.qq.com/updates`，里面可以看到所有历史版本的发布日志。

注意在发布日志中，安装文件的下载链接都是发布时刻的最新版本：`https://dldir1v6.qq.com/weixin/Windows/WeChatSetup.exe`，所以我们并不能直接从历史日志中找到下载链接。

## 第三方下载

github上的[tom-snow/wechat-windows-versions](https://github.com/tom-snow/wechat-windows-versions)项目保存了`2.0`以来的所有客户端安装包。它使用了github的actions自动下载，所以安全性基本没问题。实在担心可以自己fork一个。

### 绿色版本

绿色版本是一个压缩包，它的地址格式是`http://dldir1.qq.com/weixin/Windows/WeChat_{大版本号}.{中版本号}.{小版本号}_update{补丁版本号}.zip`。

比如`3.9.12.37`的下载地址为：`http://dldir1.qq.com/weixin/Windows/WeChat_3.9.12_update37.zip`。
