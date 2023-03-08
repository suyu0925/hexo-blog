---
title: 使用新必应New Bing
date: 2023-03-08 11:29:36
tags:
description: 微软将ChatGPT应用在了必应上，推出了新必应，但不对中国大陆提供服务，看看怎么绕过去。
---
微软推出了[New Bing](https://www.bing.com/new)，但从大陆直连会被重定向到[中国必应](https://cn.bing.com)，无法申请或使用。

顺带一提，[ChatGPT](https://chat.openai.com)也做了访问限制，ban掉了中国大陆IP和常见的机场IP。

网站会根据访问者的IP，以及Cookie等信息来判断访问者所在地区。

## 修改Http Header
如果你在网上搜索怎么在国内访问新必应，得到的答案通常会是修改Http Header。

比如使用Edge扩展[ModHeader](https://microsoftedge.microsoft.com/addons/detail/modheader-modify-http-h/opgbiafapkbbnbnjcdomjaghbckfkglc)来将[X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)设置为`8.8.8.8`。

{% asset_img mod-header.png ModHeader %}

但并不会一直成功，经常会出现错误：

{% asset_img bad-ref.png ref错误 %}

## 使用Edge Dev
有一个更简单的方法是使用[Edge Dev渠道版本](https://www.microsoftedgeinsider.com/zh-cn/download)，在Edge Dev的右上角直接有一个新必应的图标，点击即可使用。

{% asset_img edge-dev.png "Edge Dev" %}

## 使用代理

可以设置使用代理访问`www.bing.com`，可以参考这篇<a href="{% post_path 'openwrt-openclash' %}#自定义规则集">OpenClash的文章</a>。
