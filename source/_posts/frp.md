---
title: frp
date: 2022-07-27 14:23:21
tags:
- 善用佳软
description: ngrok的有力竞争者，内网穿透领域的又一霸权。
---

内网穿透就是将内网服务暴露到公网可访问，适用于没有公网IP的家庭或企业。

比较著名的开源实现有：
- [ngrok](https://github.com/inconshreveable/ngrok)
- [frp](https://github.com/fatedier/frp)
- [nps](https://github.com/cnlh/nps)

其中，ngrok提供了免费的服务器，可供测试或临时使用。
nps最全面，适合二次开发，提供给多个租户使用。
而frp使用极其简单，非常适合个人用者。

## 简述

frp由客户端和服务端构成，每个端分别有一个可执行文件，和一个配置文件。完了。

## 服务端

### 下载

下载[对应的可执行文件包](https://github.com/fatedier/frp/releases)，linux可使用`uname -m`查看。

```bash
wget https://github.com/fatedier/frp/releases/download/v0.44.0/frp_0.44.0_linux_amd64.tar.gz
tar -zxvf ./frp_0.44.0_linux_amd64.tar.gz
```

### 配置

修改frp下的`fps.ini`，一般只需要两个端口就完事。

```ini
[common]
bind_port = 7000 
vhost_bind_port = 8080
```

### 在linux下[使用systemd配置服务](https://gofrp.org/docs/setup/systemd/)

在/etc/systemd/system/下添加frp.service：
```ini
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动frps的命令，需修改为您的frps的安装路径
ExecStart = /root/frp_0.44.0_linux_amd64/frps -c  /root/frp_0.44.0_linux_amd64/frps.ini

[Install]
WantedBy = multi-user.target
```

开启服务
```bash
systemctl start frps
systemctl enable frps
```

查看服务状态和日志
```bash
systemctl status frps

journalctl -u frps -b
```

### nginx

穿透web服务搭配nginx反向代理食用最佳。注意`http://127.0.0.1:8080`中的8080就是上面的vhost_bind_port。

```conf
server {
    server_name   *.frp.yourdomain.com;
    listen        80;

    location / {
        proxy_set_header  Host $host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;        
        proxy_pass        http://127.0.0.1:8080;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";        
    }
}
```

## 客户端

### 配置

修改frpc.ini

```ini
[common]
server_addr = x.x.x.x
server_port = 7000

[ssh]
type = tcp
local_ip = 192.168.8.1
local_port = 22
remote_port = 6000

[web]
type = http
local_ip = 192.168.8.1
local_port = 8096
custom_domains = jellyfin.frp.yourdomain.com

[web2]
type = http
local_ip = 192.168.8.1
local_port = 80
custom_domains = luci.frp.yourdomain.com
```

### ssh服务

```bash
ssh -oPort=6000 x.x.x.x
```

frps在接收到客户端的`remote_port = 6000`后就会代理6000端口，于是可以使用ssh直接登录内网机器。
