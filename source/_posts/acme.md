---
title: acme
date: 2024-03-18 19:56:03
tags:
- 善用佳软
description: acme.sh是一个非常简单易用的ACME协议的客户端，可以用来申请Let's Encrypt的免费SSL证书。
---
在之前的帖子<a href="{% post_path 'configure-iis' %}#安装SSL证书">配置IIS实现反向代理</a>中已经带到过[acme.sh](https://github.com/acmesh-official/acme.sh)，这里详细介绍一下。

## 安装

```bash
curl https://get.acme.sh | sh -s email=my@example.com
```

无需root权限。

1. 将acme.sh安装到`~/.acme.sh`，并创建一个shell的alias，`alias acme.sh=~/.acme.sh/acme.sh`，放进`.bashrc`。

2. 创建cronjob，每天0点检测所有证书是否需要更新。

## 验证域名所有权，获取证书

验证域名有两种方式，http和dns。

### http

`--webroot`指定网站根目录，`-d`指定要验证的域名。

```bash
acme.sh --issue --webroot /var/www/example.com -d example.com -d www.example.com
```

### dns

不建议使用dns验证，要配合dns api，比较麻烦。

## 安装证书

```bash
mkdir -p /usr/share/certs

acme.sh --install-cert -d example.com \
--key-file       /usr/share/certs/example.com.key  \
--fullchain-file /usr/share/certs/example.com.fullchain \
--reloadcmd     "service nginx force-reload"
```

nginx有两处需要注意：
1. `ssl_certificate`指向`/etc/nginx/ssl/fullchain.cer`，而非`/etc/nginx/ssl/<domain>.cer`。
2. 使用`service nginx force-reload`而不是`reload`，因为`reload`不会重新加载`ssl_certificate`。

## 查看已安装证书信息

```bash
acme.sh --info -d example.com
# 会输出如下内容：
DOMAIN_CONF=/root/.acme.sh/example.com/example.com.conf
Le_Domain=example.com
Le_Alt=no
Le_Webroot=dns_ali
Le_PreHook=
Le_PostHook=
Le_RenewHook=
Le_API=https://acme-v02.api.letsencrypt.org/directory
Le_Keylength=
Le_OrderFinalize=https://acme-v02.api.letsencrypt.org/acme/finalize/23xxxx150/781xxxx4310
Le_LinkOrder=https://acme-v02.api.letsencrypt.org/acme/order/233xxx150/781xxxx4310
Le_LinkCert=https://acme-v02.api.letsencrypt.org/acme/cert/04cbd28xxxxxx349ecaea8d07
Le_CertCreateTime=1649358725
Le_CertCreateTimeStr=Thu Apr  7 19:12:05 UTC 2022
Le_NextRenewTimeStr=Mon Jun  6 19:12:05 UTC 2022
Le_NextRenewTime=1654456325
Le_RealCertPath=
Le_RealCACertPath=
Le_RealKeyPath=/usr/share/certs/example.com.key
Le_ReloadCmd=nginx -s reload
Le_RealFullChainPath=/usr/share/certs/example.com.fullchain
```

## 更新证书

证书会在60天后自动更新，可以查看cronjob是否生效。

```bash
crontab  -l

56 * * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
```

## 更新acme.sh

手动更新acme.sh。

```bash
acme.sh --upgrade
```

或者开启自动更新：
  
```bash
acme.sh --upgrade --auto-upgrade
```

可随时关闭自动更新：

```bash
acme.sh --upgrade --auto-upgrade 0
```

## 出错怎么办

可以添加`--debug`参数，查看详细日志。

```bash
acme.sh --issue --debug --webroot /var/www/example.com -d example.com -d www.example.com
```

可参考[How to debug acme.sh](https://github.com/Neilpang/acme.sh/wiki/How-to-debug-acme.sh)。

## 附录

### nginx配置

```nginx
server {
  server_name example.com;

  listen 80;
  listen [::]:80;

  index         index.html;
  root          /var/www/example.com;

  location / {
      # First attempt to serve request as file, then
      # as directory, then fall back to displaying a 404.
      try_files $uri $uri/ /index.html;
  }
}

server {
  server_name example.com;

  listen 443 ssl;
  listen [::]:443 ssl;

  ssl_certificate      /etc/ssl/certs/acme/example.com.fullchain;
  ssl_certificate_key  /etc/ssl/certs/acme/example.com.key;
  ssl_session_timeout  10m;
  ssl_protocols  TLSv1 TLSv1.1 TLSv1.2; #ssl 链路支持协议
  ssl_ciphers  "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";  #ssl加密支持套件
  ssl_prefer_server_ciphers   on;#优先匹配服务端加密套件

  proxy_connect_timeout 300;
  proxy_send_timeout 300;
  proxy_read_timeout 300;
  send_timeout 300;
  
  client_max_body_size 100M;

  location / {
      proxy_set_header  Host $host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass        http://127.0.0.1:5555;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }
}
```

在https配置成功后，可以将http重定向到https。注意使用的是308而不是301，这样对post等请求也生效，可以参看这篇[回复](https://stackoverflow.com/questions/13628831/apache-301-redirect-and-preserving-post-data)。

```nginx
server {
  server_name example.com;

  listen 80;
  listen [::]:80;

  return 308 https://$host$request_uri;
}
```
