---
title: 微信公众号消息中的文字链接
date: 2020-07-01 18:03:01
description: 在微信公众号后台回复文字消息时，可以在文字消息中插入`<a>`链接。
tags:
---

在微信公众号后台回复文字消息时，可以在文字消息中插入`<a>`链接。

在使用`<a href="link">text</a>`的时候，有以下几个注意事项:

1. href要使用双引号而不是单引号

2. text不能出现换行符`\n`，如果一定要换行，可使用多个a标签。

如果href使用了单引号或者text中出现了`\n`，那在安卓上就会解析a标签失败。天知道微信是怎么解析的。

