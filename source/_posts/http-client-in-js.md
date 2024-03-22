---
title: js生态的http请求库
date: 2024-03-22 15:22:37
tags:
description: 随着前端技术的发展，http请求库也在不断更新，本文介绍几个常用的http请求库。
---

js 生态的 http 请求库可以分为前端和后端。本文从我的角度介绍几个用过的库。

## 远古时代

最早接触到的 http 请求库肯定是前端的的[jQuery](https://jquery.com/)，它封装了[AJAX 技术](<https://en.wikipedia.org/wiki/Ajax_(programming)>)的[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)对象，[$.ajax](https://api.jquery.com/jQuery.ajax/)陪伴了无数前端开发者。

## node.js 诞生

后端生态由[node.js](https://nodejs.org/)于 2009 年一手创建。node.js 内建了[http](https://nodejs.org/docs/latest/api/http.html)模块，可以用来创建 http 服务器和客户端。但 http 太底层，使用起来不够方便，所以有了各种请求库。

我最早接触的后端 http 请求库是已经停止维护的[request](https://nodejs.org/docs/v0.2.0/api.html)。它作为 node 生态中最早的一批库，与 node.js 一同发展。随着 js 生态的发展，很多生态中的功能被吸收为标准，`request`的设计已经过时，于 2019 年[宣布停止维护](https://github.com/request/request/issues/3142)。

## 生态大爆发

在 2009 年左右，node.js、html5 等技术的出现，刚好贴合移动互联网的需求。互相促进下，停滞不前的 js 生态进入了寒武纪生态大爆发。

这期间百家争鸣，出现了很多`request`的竞争者，比如[needle](https://github.com/tomas/needle)、[superagent](https://github.com/ladjs/superagent)、[got](https://github.com/sindresorhus/got)等。

## Promise

2015 年，众盼已久的 es6/es2015 发布，它带来了很多新特性，其中最重磅的特性之一是[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)。Promise 解决了回调地狱的问题，使得异步编程更加优雅。

在此之后，如果一定要选出一个 http 请求库的王者，那它一定是[axios](https://github.com/axios/axios)。axios 基于 Promise 开发，同时支持浏览器和 node.js。

## Fetch

虽然和 Promise 一起发布的标准还有[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，但传导到浏览器，再传导到用户还需要时间。

node.js 也花了很长的时间，直到 2022 年发布的[v17.5.0](https://nodejs.org/en/blog/release/v17.5.0) 才支持了 Fetch API。

后起之秀的 js runtime，比如[deno](https://deno.land/api?s=fetch)和[bun](https://bun.sh/guides/http/fetch)，也在早期就支持了 Fetch API。

在这期间，出现了很多围绕 fetch 做 polyfill 的库，比如：[node-fetch](https://github.com/node-fetch/node-fetch)、[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)。

基于 Fetch 又有了新一代的请求库，比如：

- node 官方的[undici](https://github.com/nodejs/undici)
- [got](https://github.com/sindresorhus/got)作者基于 fetch 重新开发的[ky](https://github.com/sindresorhus/ky)

基本上，Fetch API 已经成为了 js 生态的新标准。

我个人的选择是，node 端用 undici，浏览器端简单需求就用 fetch，复杂需求用 axios 或 ky。

## 结语

js 生态的发展速度之快，让人眼花缭乱。本文只是出于我个人的角度，不准确也不全面。如果你有更好的建议，欢迎留言。
