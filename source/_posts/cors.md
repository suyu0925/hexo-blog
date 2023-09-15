---
title: 跨域资源共享（CORS）
date: 2023-09-15 16:16:46
tags:
description: 在网络开发时，老是会碰到跨域问题，这里整理一下。
---
首先的首先，跨域资源共享（Cross-Origin Resource Sharing，简称[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)）是为浏览器服务的，web api可以无视。

它赋予了浏览器阻止前端JavaScript代码访问跨域请求的能力。

## 什么是跨域请求

跨域请求是指在浏览器中，通过前端JavaScript代码发送的HTTP请求，目标资源位于当前网页所在的域之外。
换句话说，当一个网页尝试从不同的源（域、协议或端口）请求数据或资源时，就会发生跨域请求。

举个实际的例子：微信防盗图。

我们随便找一个微信公众号文章，从里面找一张图片，比如上海发布的[这张图](https://mmbiz.qpic.cn/mmbiz_gif/qdWB7wH8tToVOJUFAamQplZiaeSUp5JOK4aicbicMBfRCmnKxwwQicuCEyP48QZadBPicCRhgSiaqFu2b3qIMcaawlYA/640?wx_fmt=gif&wxfrom=5&wx_lazy=1)。

**直接打开**
直接在浏览器中点击打开，显示正常。

**本地文件**
但如果我们把这个链接加到一个网页中，比如：
```html
<html>
  <head>
    <title>测试微信防盗图</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <img
      src="https://mmbiz.qpic.cn/mmbiz_gif/qdWB7wH8tToVOJUFAamQplZiaeSUp5JOK4aicbicMBfRCmnKxwwQicuCEyP48QZadBPicCRhgSiaqFu2b3qIMcaawlYA/640?wx_fmt=gif&wxfrom=5&wx_lazy=1"
    />
  </body>
</html>
```
将它保存为`test.html`，然后在浏览器中打开，会发现图片显示仍然正常。这是从文件系统中打开的，微信允许这种跨域。

**跨域请求**
我们在`test.html`同目录运行一个网络服务，比如：
```bash
python -m http.server 8000
```
然后使用这个网址`http://localhost:8000/test.html`再次打开这个网页，会发现图片显示不正常了。

{% asset_img cors_is_not_allowed.jpg 未经允许不可引用 %}

这是因为微信判断了请求头中的[Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)，发现它们不是微信的域名，所以返回了错误提示图片。

在这个例子里，为了更简单，我们使用了图片而不是JavaScript代码。[在默认的情形下](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)，图片的访问并没有使用CORS。但足够我们对CROS有初步的认识。

### Access-Control-Allow-Origin响应头

当发生跨域访问时，首先浏览器会发出一个`preflight`请求，用来快速判断一个网络服务支不支持跨域访问。
此时需要网络服务在返回头中包含`Access-Control-Allow-Origin`来指定支持哪种跨域访问。
比如
```
header("Access-Control-Allow-Origin: https://domain1.com")
```
表示支持origin为`https://domain1.com`来的跨域请求。

也可以使用通配符`(*)`来代表不限制来源：
```
header("Access-Control-Allow-Origin: *")
```

### Origin请求头
浏览器会在请求头中添加Origin属性，比如在打开一个`http://localhost:8080`上的网页，js脚本使用了fetch访问`http://localhost:5000/api`，此次fetch的请求头中，Origin会是`http://localhost:8080`。

## cookie

cookie属于credentials。

### 响应头
如果想跨域设置cookie，需要在响应头中添加这些：
-  [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)设置为true
- 上面提到过的[`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)，要满足当前Origin，[且不能为`*`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials)
-  [`Access-Control-Allow-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)设置为`Content-Type, *`

### Cookie
-  [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)不能被设置为Strict

### 浏览器端
在浏览器端需要设置[Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)。

不同的库有不同的设置方法：
- [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) 用 `xhr.withCredentials = true`
- [ES6 fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials) 用 `credentials: 'include'`
- [jQuery 1.5.1](https://stackoverflow.com/a/7190487/2237467) 用 `xhrFields: { withCredentials: true }`
- [axios](https://stackoverflow.com/a/40543547/2237467) 用 `withCredentials: true`
