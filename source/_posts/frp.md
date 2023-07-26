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

### fprs

frps有两种方式运行，一种是使用可执行文件并配置为systemd服务，另一种是使用docker。

#### 使用可执行文件

- 下载

下载[对应的可执行文件包](https://github.com/fatedier/frp/releases)，linux可使用`uname -m`查看。

```bash
wget https://github.com/fatedier/frp/releases/download/v0.44.0/frp_0.44.0_linux_amd64.tar.gz
tar -zxvf ./frp_0.44.0_linux_amd64.tar.gz
```

- 配置

修改frp下的`fps.ini`，一般只需要两个端口就完事。

```ini
[common]
# 监听端口
bind_port = 7000 
# 面板端口
dashboard_port = 7500
# 登录面板账号设置
dashboard_user = admin
dashboard_pwd = frps1234
# 设置http及https协议下代理端口
vhost_bind_port = 7080
vhost_https_port = 7081

# 身份验证
token = 12345678
```

- 在linux下[使用systemd配置服务](https://gofrp.org/docs/setup/systemd/)

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

- 开启服务
```bash
systemctl start frps
systemctl enable frps
```

- 查看服务状态和日志
```bash
systemctl status frps

journalctl -u frps -b
```

#### 使用docker

使用docker则简单多了，只需要修改`frps.ini`，然后运行docker即可。

这里默认`frps.ini`创建在了`/etc/frp/`下。
```bash
docker run --restart=always --network host -d -v /etc/frp/frps.ini:/etc/frp/frps.ini --name frps snowdreamtech/frps
```

### nginx

穿透web服务搭配nginx反向代理食用最佳。注意`http://127.0.0.1:7080`中的7080就是上面的vhost_bind_port。

```conf
server {
    server_name   *.frp.yourdomain.com;
    listen        80;

    location / {
        proxy_set_header  Host $host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;        
        proxy_pass        http://127.0.0.1:7080;

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

[jellyfin]
type = http
local_ip = 192.168.8.1
local_port = 8096
custom_domains = jellyfin.frp.yourdomain.com

[luci]
type = http
local_ip = 192.168.8.1
local_port = 80
custom_domains = luci.frp.yourdomain.com

[aria2]
type = http
local_ip = 192.168.8.1
local_port = 6800
custom_domains = aria2.frp.yourdomain.com

[clash]
type = http
local_ip = 192.168.8.1
local_port = 9090
custom_domains = clash.frp.yourdomain.com
```

注意像`[jellyfin]`这样的名字不要有重复，会被当作ID使用。

### ssh服务

```bash
ssh 内网用户名@x.x.x.x -p 6000
输入内网用户密码: 
```

frps在接收到客户端的`remote_port = 6000`后就会代理6000端口，于是可以使用ssh直接登录内网机器。

### ariang

需要修改ariang的rpc地址，把默认的`http://${host}:6800/jsonrpc`改成`http://aria2.frp.yourdomain.com:80/jsonrpc`才能使用。

### 使用docker

在本地创建`frpc.ini`，比如`f:/frp/frpc.ini`。

然后使用[第三方docker image](https://github.com/stilleshan/frpc)：
```bash
docker run -d --name=frpc --restart=always -v f:/frp/frpc.ini:/frp/frpc.ini stilleshan/frpc
```

修改配置则需要重启docker：
```bash
docker restart frpc
```

### openclash

需要修改openclash控制台的连接设置，默认是：
```ini
Host: 192.168.8.1
端口: 9090
密钥：123456
```

需要修改为：
```ini
Host: clash.frp.yourdomain.com
端口: 80
密钥：123456
```
