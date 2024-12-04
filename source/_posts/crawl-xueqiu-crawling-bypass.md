---
title: 【雪球爬虫】绕过反爬
date: 2024-12-04 14:06:50
tags:
description: 开个新坑，雪球爬虫系列。这篇讲反爬。
---

## 初印象

作为提供金融相关数据的网站，雪球一定有做一定程度的反爬。

以[实时新闻接口](https://xueqiu.com/statuses/livenews/list.json)举例。如果用一个没有访问过雪球网站的浏览器来访问这个网址，会得到[状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)为`400`的返回:

```json
{
  "error_description": "遇到错误，请刷新页面或者重新登录帐号后再试",
  "error_uri": "/statuses/livenews/list.json",
  "error_data": null,
  "error_code": "400016"
}
```

但如果在浏览器里先访问一次雪球页面，无需登录，再访问这个接口，就可以正常返回。

## 阿里云 WAF

反爬机制的第一层是[阿里云 WAF](https://help.aliyun.com/zh/waf/web-application-firewall-3-0/product-overview/what-is-waf)，它[会植入](https://help.aliyun.com/zh/waf/web-application-firewall-3-0/web-application-firewall-3-0-security-compliance-instructions#60eaa86b7ef4w)一个名为`acw_tc`的 cookie，有效期为`30分钟`，在之后的的交互中会验证它。

## 雪球自身 cookie

雪球植入的 cookie 有很多，但 API 会验证的只有`xq_a_token`一个。只需要用浏览器访问过一次雪球网站，就会有这个 cookie。我们可以先用浏览器访问一次，然后把这些 cookie 复制到爬虫里。

## 敏感数据

像实时新闻和行情这些数据比较不敏感，如果想获取某个大 V 的时间线，会有额外的反爬机制。

以获取大 V[大道无形我有型](https://xueqiu.com/u/1247347556)最新时间线[API](https://xueqiu.com/v4/statuses/user_timeline.json?user_id=1247347556)为例。

即使在 cookie 里带上了`acw_tc`和`xq_a_token`，也不会正常返回数据，而是返回一个 html 页面。

这个 html 页面没有显示内容，只有一个`script`标签。作用是生成`md5`参数然后带着这个参数跳转。

看了一下生成参数的代码，混淆程度很高，js 逆向水平不够，暂时挂起。这里有一个[帖子](https://ask.csdn.net/questions/8164591)可以关注。

## 更敏感的数据

即使是带上了`md5__1038`校验参数，在获取[第 2 页时间线](https://xueqiu.com/v4/statuses/user_timeline.json?user_id=1247347556&page=2)时，仍然会得到一个状态码为`400`的错误:

```json
{
  "error_description": "请登录雪球查看更多内容",
  "error_uri": "/v4/statuses/user_timeline.json",
  "error_data": null,
  "error_code": "10022"
}
```

到这里就真正需要用户登录了。通过`xq_a_token`来关联用户。

## 解决方案

暂时放弃逆向 md5 参数算法，使用[无头浏览器](https://www.bright.cn/blog/web-data/best-headless-browsers)。
