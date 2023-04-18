---
title: 介绍Kong Gateway
date: 2023-04-14 16:08:18
tags:
description: 想快速实现一个API网关？来看看Kong Gateway。
hidden: true
---
[Kong Gateway](https://docs.konghq.com/gateway/latest/)是[Kong公司](https://konghq.com/)的云原生API网关产品，搭建于[OpenResty](https://openresty.org/)之上，用于部署、保护和监控API。

它有[开源版](https://github.com/Kong/kong)和商业版两种，对普通用户来说[主要区别](https://docs.konghq.com/gateway/3.2.x/#features)也就只是开源版没有Admin GUI。

## 快速上手

在深入了解它的功能之前，先迅速安装来感受一下。

### 安装

最简单的安装方式当然是使用[Docker](https://docs.konghq.com/gateway/3.2.x/install/docker/)。

不过Kong网关需要数据库来存放一些配置文件，我们在之前的{% post_link postgres-on-docker 使用docker上的postgres代替本机安装 %}文章中，已经在Docker中安装了postgres，这里直接拿来用。

1. 首先手动在postgres中创建一个`kong`数据库。

2. 然后初始化数据库
```powershell
docker run --rm --network=postgres12 `
  -e "KONG_DATABASE=postgres" `
  -e "KONG_PG_HOST=pg12" `
  -e "KONG_PG_DATABASE=kong" `
  -e "KONG_PG_USER={your_kong_pg_user}" `
  -e "KONG_PG_PASSWORD={your_kong_pg_password}" `
 kong/kong-gateway:3.2.2.1 kong migrations bootstrap
```

3. 运行
```powershell
docker run -d --name kong-gateway `
  --network=postgres12 `
  -e "KONG_DATABASE=postgres" `
  -e "KONG_PG_HOST=pg12" `
  -e "KONG_PG_DATABASE=kong" `
  -e "KONG_PG_USER={your_kong_pg_user}" `
  -e "KONG_PG_PASSWORD={your_kong_pg_password}" `
  -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" `
  -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" `
  -e "KONG_PROXY_ERROR_LOG=/dev/stderr" `
  -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" `
  -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" `
  -e "KONG_ADMIN_GUI_URL=http://localhost:8002" `
  -e KONG_LICENSE_DATA `
  -p 8000:8000 `
  -p 8443:8443 `
  -p 8001:8001 `
  -p 8444:8444 `
  -p 8002:8002 `
  -p 8445:8445 `
  -p 8003:8003 `
  -p 8004:8004 `
  kong/kong-gateway:3.2.2.1
```

4. 验证安装
访问`/services`端点：
```powershell
curl http://localhost:8001/services
```
应该能得到`200`的状态码返回。

**控制台**
在上面的docker run命令中，我们指定了`KONG_ADMIN_GUI_URL`，虽然没有`KONG_LICENSE_DATA`，但Kong还是提供了企业版的免费模式让我们体验Admin GUI。

## 核心概念

### 服务（[Services](https://docs.konghq.com/gateway/3.2.x/key-concepts/services/)）

在Kong网关里，服务即为在网关后要对接的上游API或者微服务。服务的核心属性是网址。

Kong网关通过路由（Routes）将服务暴露给客户端。由于客户端始终调用路由，因此对服务进行更改不会影响客户端调用的方式，从而隔离服务与客户端。并且可以针对路由应用不同的策略。

**举例**

假如我们有一个外部客户端和一个内部客户端需要访问`hwservice`服务，但是外部客户端必须限制查询该服务的频率以确保不会出现拒绝服务的情况。如果为`hwservice`服务配置了速率限制策略，当内部客户端调用服务时，内部客户端也会受到限制。路由解决了这个问题。

创建两个路由分别给外部和内部访问，假如`/external`和`/internal`，都指向`hwservice`服务。然后配置一个策略来限制`/external`路由的访问频率。搞定。

### 路由（[Routes](https://docs.konghq.com/gateway/3.2.x/key-concepts/routes/)）

Kong网关支持两种路由：`traditional_compat`和`expressions`。

**traditional_compat**

在传统兼容模式下，路由会按顺序确定：
1. Priority points
2. Wildcard hosts
3. Header count
4. Regular expressions and prefix paths

**expressions**

打开`expressions`路由需要修改[kong.conf](https://docs.konghq.com/gateway/latest/production/kong-conf/)，设置`router_flavor = expressions`，然后重启Kong网关。
在打开`expressions`后，传统的路由对象（比如`paths`，`methods`）会失效，需要指定`expression`项中的表达式。

### 上游（[Upstreams](https://docs.konghq.com/gateway/3.2.x/key-concepts/upstreams/)）

上游这个概念与Nginx中的[upstream](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#upstream)一样，一个上游可以是多个服务，主要为了[负载均衡](https://docs.konghq.com/gateway/3.2.x/get-started/load-balancing/)。

### 插件（[plugins](https://docs.konghq.com/gateway/3.2.x/key-concepts/plugins/)）
