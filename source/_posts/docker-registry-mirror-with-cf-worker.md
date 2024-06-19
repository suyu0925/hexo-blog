---
title: 使用cf worker实现docker的自建镜像站
date: 2024-06-20 00:27:26
tags:
- docker
description: docker在近日被墙，码农们拼命自救，感谢大善人cf。
---

## worker

不废话直接上代码：

```javascript
'use strict'
const hub_host = 'registry-1.docker.io'
const auth_url = 'https://auth.docker.io'
// 请将 hub.weiyigeek.eu.org 替换为自己的域名
const workers_url = 'https://hub.weiyigeek.eu.org'
const PREFLIGHT_INIT = {
    status: 204,
    headers: new Headers({
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
        'access-control-max-age': '1728000',
    }),
}
function makeRes (body, status = 200, headers = {}) {
    headers['access-control-allow-origin'] = '*'
    return new Response(body, { status, headers })
}
function newUrl (urlStr) {
    try {
        return new URL(urlStr)
    } catch (err) {
        return null
    }
}
addEventListener('fetch', e => {
    const ret = fetchHandler(e)
        .catch(err => makeRes('cfworker error:\n' + err.stack, 502))
    e.respondWith(ret)
})
async function fetchHandler (e) {
    const getReqHeader = (key) => e.request.headers.get(key);
    let url = new URL(e.request.url);
    if (url.pathname === '/token') {
        let token_parameter = {
            headers: {
                'Host': 'auth.docker.io',
                'User-Agent': getReqHeader("User-Agent"),
                'Accept': getReqHeader("Accept"),
                'Accept-Language': getReqHeader("Accept-Language"),
                'Accept-Encoding': getReqHeader("Accept-Encoding"),
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0'
            }
        };
        let token_url = auth_url + url.pathname + url.search
        return fetch(new Request(token_url, e.request), token_parameter)
    }
    url.hostname = hub_host;
    let parameter = {
        headers: {
            'Host': hub_host,
            'User-Agent': getReqHeader("User-Agent"),
            'Accept': getReqHeader("Accept"),
            'Accept-Language': getReqHeader("Accept-Language"),
            'Accept-Encoding': getReqHeader("Accept-Encoding"),
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0'
        },
        cacheTtl: 3600
    };
    if (e.request.headers.has("Authorization")) {
        parameter.headers.Authorization = getReqHeader("Authorization");
    }
    let original_response = await fetch(new Request(url, e.request), parameter)
    let original_response_clone = original_response.clone();
    let original_text = original_response_clone.body;
    let response_headers = original_response.headers;
    let new_response_headers = new Headers(response_headers);
    let status = original_response.status;
    if (new_response_headers.get("Www-Authenticate")) {
        let auth = new_response_headers.get("Www-Authenticate");
        let re = new RegExp(auth_url, 'g');
        new_response_headers.set("Www-Authenticate", response_headers.get("Www-Authenticate").replace(re, workers_url));
    }
    if (new_response_headers.get("Location")) {
        return httpHandler(e.request, new_response_headers.get("Location"))
    }
    let response = new Response(original_text, {
        status,
        headers: new_response_headers
    })
    return response;
}
function httpHandler (req, pathname) {
    const reqHdrRaw = req.headers
    // preflight
    if (req.method === 'OPTIONS' &&
        reqHdrRaw.has('access-control-request-headers')
    ) {
        return new Response(null, PREFLIGHT_INIT)
    }
    let rawLen = ''
    const reqHdrNew = new Headers(reqHdrRaw)
    const refer = reqHdrNew.get('referer')
    let urlStr = pathname
    const urlObj = newUrl(urlStr)
    /** @type {RequestInit} */
    const reqInit = {
        method: req.method,
        headers: reqHdrNew,
        redirect: 'follow',
        body: req.body
    }
    return proxy(urlObj, reqInit, rawLen, 0)
}
async function proxy (urlObj, reqInit, rawLen) {
    const res = await fetch(urlObj.href, reqInit)
    const resHdrOld = res.headers
    const resHdrNew = new Headers(resHdrOld)
    // verify
    if (rawLen) {
        const newLen = resHdrOld.get('content-length') || ''
        const badLen = (rawLen !== newLen)
        if (badLen) {
            return makeRes(res.body, 400, {
                '--error': `bad len: ${newLen}, except: ${rawLen}`,
                'access-control-expose-headers': '--error',
            })
        }
    }
    const status = res.status
    resHdrNew.set('access-control-expose-headers', '*')
    resHdrNew.set('access-control-allow-origin', '*')
    resHdrNew.set('Cache-Control', 'max-age=1500')
    resHdrNew.delete('content-security-policy')
    resHdrNew.delete('content-security-policy-report-only')
    resHdrNew.delete('clear-site-data')
    return new Response(res.body, {
        status,
        headers: resHdrNew
    })
}
```

这段代码的作用是将来自`workers_url`的请求反向代理到`registry-1.docker.io`。如果有登录相关请求，增加`auth.docker.io`的处理。

## worker的触发器

虽然worker会有一个`https://docker-hub.${yourid}.workers.dev/`的域名，但它并不能处理`https://docker-hub.${yourid}.workers.dev/*`，我们还是需要一个域名。

在worker的触发器中添加一个路由：
路由为`hub.weiyigeek.eu.org/*`，注意那个`/*`，这个是必须的。否则`/v2`、`/token`等请求都无法被worker处理。
区域为`weiyigeek.eu.org`，这个是自己的域名。

## 添加DNS解析

在cf的DNS解析中添加一个A解析，将`hub.weiyigeek.eu.org`随便解析到什么IP，IP乱写就好，重点是后面的使用cf代理。这样才能进行worker的路由匹配。

## 配置docker

最后是配置docker。在`/etc/docker/daemon.json`中添加：

```json
{
  "registry-mirrors": ["https://hub.weiyigeek.eu.org"]
}
```

然后重启服务：

```sh
sudo systemctl restart docker
```

注意，如果是使用[snap](https://snapcraft.io/)安装的docker，那么配置文件和重启服务的方式会有所不同。

配置文件的路径为`/var/snap/docker/current/config/daemon.json`，重启服务的方式则为：

```sh
sudo snap restart docker
```

这样直接使用`docker pull busybox`就相当于`docker pull hub.weiyigeek.eu.org/busybox`，实现了docker的自建镜像站。

需要注意的是，免费的cf worker有每日10万次请求的限制，所以不要暴露你的worker地址，以免被滥用。
