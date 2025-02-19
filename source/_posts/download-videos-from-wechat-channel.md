---
title: 从微信视频号下载视频
date: 2023-09-21 20:22:12
tags:
- weixin
description: 有时候我们看到微信视频号里的内容觉得很好，想下载下来收藏，但微信不提供下载功能，此时我们可以这样做。
---

**2025年02月19日更新：**

之前将嗅探到的链接中的`20302`改为`20304`就可以下载到原视频的方法已经失效。

下载的视频文件是加密过的，只能使用微信在网页中的WASM算法`Module.WxIsaac64`进行解密。详情可参考[kanadeblisst的公众号文章](https://mp.weixin.qq.com/s/wCOR38UNiSml2jM0udX3IQ)中的解密部分。

建议直接使用[res-downloader](https://github.com/putyy/res-downloader)工具下载，不用手动嗅探。
