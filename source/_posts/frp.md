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
wget https://github.com/fatedier/frp/releases/download/v0.52.3/frp_0.52.3_linux_amd64.tar.gz
tar -zxvf ./frp_0.52.3_linux_amd64.tar.gz
```

- 配置

修改frp下的`fps.toml`，一般只需要两个端口就完事。

为了安全，要添加[权限验证](https://gofrp.org/zh-cn/docs/reference/server-configures/#%E6%9D%83%E9%99%90%E9%AA%8C%E8%AF%81)。

```toml
# 监听端口
bindPort = 7000 

# 面板端口
webserver.port = 7500
# 登录面板账号设置
webserver.user = "admin"
webserver.apssword = "frps1234"

# 设置http及https协议下代理端口
vhostHTTPPort = 7080
vhostHTTPSPort = 7081

# 权限验证
auth.method = "token" ## 默认为token，可选为：token、oidc
auth.additionalScopes = ["HeartBeats", "NewWorkConns"]
auth.token = "your-unguessable-token" ## 鉴权使用的token值，客户端需要设置一样的值才能鉴权通过
```

- 在linux下[使用systemd配置服务](https://gofrp.org/zh-cn/docs/setup/systemd/)

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
ExecStart = /root/frp_0.52.3_linux_amd64/frps -c /root/frp_0.52.3_linux_amd64/frps.toml

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

使用docker则简单多了，只需要修改`frps.toml`，然后运行docker即可。

这里默认`frps.toml`创建在了`/root/frp/`下。
```bash
docker run --restart=always --network host -d -v /root/frp/frps.toml:/etc/frp/frps.toml --name frps snowdreamtech/frps
```

### nginx

穿透web服务搭配nginx反向代理食用最佳。注意`http://127.0.0.1:7080`中的`7080`就是上面的`vhostHTTPPort`。

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

修改frpc.toml

```toml
# common
serverAddr = "x.x.x.x" # your server's ip or domain
serverPort = 7000

# 权限验证
auth.method = "token"## 鉴权方式，需要和服务端一致
auth.additionalScopes = ["NewWorkConns"] ## 开启建立工作连接的鉴权，需要和服务端一致
auth.token = "your-unguessable-token" ## 鉴权使用的token值，需要和服务端设置一样的值才能鉴权通过

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "192.168.8.1"
localPort = 22
remotePort = 6000

[[proxies]]
name = "jellyfin"
type = "http"
localIP = "192.168.8.1"
localPort = 8096
customDomains = ["jellyfin.frp.yourdomain.com"]

[[proxies]]
name = "luci"
type = "http"
localIP = "192.168.8.1"
localPort = 80
customDomains = ["luci.frp.yourdomain.com"]

[[proxies]]
name = "aria2"
type = "http"
localIP = "192.168.8.1"
localPort = 6800
customDomains = ["aria2.frp.yourdomain.com"]

[[proxies]]
name = "clash"
type = "http"
localIP = "192.168.8.1"
localPort = 9090
customDomains = ["clash.frp.yourdomain.com"]

注意`name`不要有重复。

### ssh服务

```bash
ssh 内网用户名@x.x.x.x -p 6000
输入内网用户密码: 
```

frps在接收到客户端的`remote_port = 6000`后就会代理6000端口，于是可以使用ssh直接登录内网机器。

### ariang

需要修改ariang的rpc地址，把默认的`http://${host}:6800/jsonrpc`改成`http://aria2.frp.yourdomain.com:80/jsonrpc`才能使用。

### 使用docker

在本地创建`frpc.toml`，比如`/root/frpc/frpc.toml`。

然后使用[第三方docker image](https://github.com/snowdreamtech/frp)：
```bash
docker run -d --name=frpc --restart=always -v /root/frpc/frpc.toml:/etc/frp/frpc.toml snowdreamtech/frpc
```

修改配置则需要重启docker：
```bash
docker restart frpc
```

### openclash

需要修改openclash控制台的连接设置，默认是：
```
Host: 192.168.8.1
端口: 9090
密钥：123456
```

需要修改为：
```
Host: clash.frp.yourdomain.com
端口: 80
密钥：123456
```
