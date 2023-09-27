---
title: API测试工具
date: 2023-09-27 10:02:01
tags:
- 善用佳软
description: 推荐几款API测试工具。
---
在开发Web API时，经常需要测试API的返回结果。

通常的做法在服务器端写一个单元测试，但挺难做到状态的长久保持，比如cookie。而且也不够解藕。

## 初试

[postman](https://www.postman.com/)应需而生。

它一开始是chrome的扩展，功能强大后独立成了桌面应用。

随着开发成本越来越高，自然转为了商业应用。

## 新宠

随着vs code的不断发展，[Thunder Client](https://www.thunderclient.com/)作为vs code的扩展，基本取得到当年postman的成就。

可惜步postman后尘，也转向了商业应用。

## 国产

在Thunder Client之后发现一个国产工具，[ApiFox](https://apifox.com/)。

它拥有一贯的国产毛病：
- 什么都想做。把[Postman](https://www.postman.com/) + [Swagger](https://swagger.io/) + [Mock](http://mockjs.com/) + [JMeter](https://jmeter.apache.org/)的功能全含了进去
- 要求登录才能使用

算是无赖之选吧。
