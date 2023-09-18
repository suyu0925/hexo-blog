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

## 一个简单的跨域请求例子

我们修改一下`test.html`，使用[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)来发送一个跨域请求，比如：
```html
<html>
  <head>
    <title>测试跨域请求</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      const log = (msg) => {
        document.getElementById("log").innerHTML += `<p>${msg}</p>`;
      };
      const f = async () => {
        const request = new Request("http://localhost:3000/api/hello", {
          method: "post",
        });
        const result = await fetch(request);
        const text = await result.text();
        log(text);
      };
      f().catch((err) => {
        log(err);
      });
    </script>
  </body>
</html>
```

然后我们需要运行一个网络服务来提供web api服务，此时python的简单http.server就不够用了，我们换[deno](https://deno.com/)：
```typescript
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"

const app = express()
const port = 3000

app.post('/api/hello', (req, res) => {
  res.send('Welcome to the Dinosaur API!')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
```

我们先运行起来这个服务：
```bash
deno run -A ./server.ts
```

使用[Invoke-WebRequest](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest)来测试一下：
```bash
PS > Invoke-WebRequest -Method 'POST' -Uri 'http://localhost:5000/api/hello'
StatusCode        : 200
StatusDescription : OK
Content           : Welcome to the Dinosaur API!
RawContent        : HTTP/1.1 200 OK
                    vary: Accept-Encoding
                    Content-Length: 28
                    Content-Type: text/html; charset=utf-8
                    Date: Mon, 18 Sep 2023 02:45:27 GMT
                    ETag: W/"1c-GX2ZfGSbrWakhyxxP2SDs+BrRUw"
                    X-Powered-By: Express...
Forms             : {}
Headers           : {[vary, Accept-Encoding], [Content-Length, 28], [Content-Type, text/html; charset
                    =utf-8], [Date, Mon, 18 Sep 2023 02:45:27 GMT]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 28
```

接着我们仍然在`test.html`同目录使用`python -m http.server 8000`来运行一个网络服务，然后在浏览器中打开`http://localhost:8000/test.html`。

### 跨域错误
会发现控制台中有错误：
> test.html:1  Access to fetch at 'http://localhost:3000/api/hello' from origin 'http://localhost:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

意思是返回头没有指定包含[Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)，所以浏览器阻止了前端JavaScript代码访问跨域请求的返回内容。

但这个请求本身是成功的，我们可以在浏览器调试工具的网络窗口中查看到返回头：
```text
HTTP/1.1 200 OK
content-length: 28
content-type: text/html; charset=utf-8
etag: W/"1c-GX2ZfGSbrWakhyxxP2SDs+BrRUw"
x-powered-by: Express
vary: Accept-Encoding
date: Mon, 18 Sep 2023 03:13:36 GMT
```
只是浏览器阻止了[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)的返回内容并报错。

### no-cors request mode
控制台的错误提示有这么一句：
> If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

如果我们需要的是不透明的返回，可以设置[request.mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)为`no-cors`来禁用CORS。

什么叫不透明的返回呢？意思是只关心调用是否成功，不关心返回内容。

我们试着修改一下fetch的Request：
```typescript
const request = new Request("http://localhost:3000/api/hello", {
  method: "post",
  mode: "no-cors",
});
```
会发现控制台中的错误消失了，但返回内容会为空。所以在绝大多数情况下，`no-cors`并不是我们需要的。

在使用Request()构建函数时，[mode的默认值](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode#default_mode)为`cors`。
而在使用嵌入资源时，比如`<img>`，`<iframe>`这些标签时，除非设置了[crossorigin属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)，否则默认值为`no-cors`。

### simple request和preflight request
在上面的例子中，我们发出的跨域请求属于[simple request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)，不会触发[preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)。

之所以不对所有跨域请求都使用preflight机制，是为了支持表单`<form>`。简单的表单提交是允许跨域的。

如果我们修改一下headers中的Content-Type，就会出现preflight请求了：
```typescript
const request = new Request("http://localhost:3000/api/hello", {
  method: "post",
  headers: {
    "Content-Type": "text/xml",
  },
});
```

## 解决跨域错误

当发生跨域请求时，不管是simple request还是preflight request，浏览器都会在返回头中检查[Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)是否包含当前[Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)。

浏览器会在请求头中添加Origin属性，比如在打开一个`http://localhost:8080`上的网页，js脚本使用了fetch访问`http://localhost:5000/api`，此次fetch的请求头中，Origin会是`http://localhost:8080`。

而默认的返回头不包含`Access-Control-Allow-Origin`，所以检查不通过。

解决方法也很简单，在服务端返回头中添加`Access-Control-Allow-Origin`即可。

### cors中间件

几乎所有网络服务框架都提供了cors中间件，比如express的[cors](https://github.com/expressjs/cors)，fastify的[fastify-cors](https://github.com/fastify/fastify-cors), koa的[@koa/cors](https://github.com/koajs/cors)。

在默认配置下，cors中间件会在返回头中添加`Access-Control-Allow-Origin: *`，这样就允许了所有的跨域请求。

修改后的服务端代码：
```typescript
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
// @deno-types="npm:@types/cors@2"
import cors from "npm:cors@2.8.5"

const app = express()
const port = 3000

app.use(cors())

app.post('/api/hello', (req, res) => {
  res.send('Welcome to the Dinosaur API!')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
```

### 浏览器扩展

因为阻止跨域请求是由浏览器来做的，所以在无法修改服务器时，也可以使用浏览器扩展来解决。Chrome有很多[相关扩展](https://chrome.google.com/webstore/search/cors)，实现原理是在所有返回头中都加上`Access-Control-Allow-Origin: *`。

## 另一个问题：跨域Set-Cookie

有时我们需要在跨域请求中设置cookie，我们修改一下服务端代码：
```typescript
app.post('/api/hello', (req, res) => {
  res
    .cookie('cors-cookie', 'my-ors-cookie')
    .send('Welcome to the Dinosaur API!')
})
```

可以看到返回头中多了一个`Set-Cookie`：
```text
Set-Cookie: cors-cookie=my-ors-cookie; Path=/
```

但是在请求完成后，打开浏览器的调试工具查看Cookies，我们会发现cookie并没有被设置。

### credentials

原因是cookie属于credentials。而[credentials在跨域时](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)默认是不被允许的。

### 跨域使用credentials
想要跨域设置cookie，需要满足以下条件：

**响应头**
如果想跨域设置cookie，需要在响应头中添加这些：
-  [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)设置为`true`
- 上面提到过的[Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)，要满足当前Origin，[且不能为`*`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials)

**浏览器端**
在浏览器端需要设置[Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)为`include`。

不同的库有不同的设置方法：
- [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) 用 `xhr.withCredentials = true`
- [ES6 fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials) 用 `credentials: 'include'`
- [jQuery 1.5.1](https://stackoverflow.com/a/7190487/2237467) 用 `xhrFields: { withCredentials: true }`
- [axios](https://stackoverflow.com/a/40543547/2237467) 用 `withCredentials: true`

### 扩展阅读

**响应头**
-  [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)设置为`Content-Type, *`

**Set-Cookie**
-  [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)不能被设置为`Strict`

### 解决方案

最后贴一下完整的代码。

服务端
```typescript
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
// @deno-types="npm:@types/cors@2"
import cors from "npm:cors@2.8.5"

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}))

app.post('/api/hello', (req, res) => {
  res
    .cookie('cors-cookie', 'my-ors-cookie')
    .send('Welcome to the Dinosaur API!')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
```

客户端
```html
<html>
  <head>
    <title>测试跨域请求</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      const log = (msg) => {
        document.getElementById("log").innerHTML += `<p>${msg}</p>`;
      };
      const f = async () => {
        const request = new Request("http://localhost:3000/api/hello", {
          method: "post",
          credentials: "include",
        });
        const result = await fetch(request);
        const text = await result.text();
        log(text);
      };
      f().catch((err) => {
        log(err);
      });
    </script>
  </body>
</html>
```