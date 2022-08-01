---
title: "[OpenWrt]使用samba"
date: 2022-08-01 14:29:21
tags:
- openwrt
description: 在openwrt中运行samba服务以便更好的管理文件。
---
为了更好的管理openwrt上的文件，我们开启[samba](https://openwrt.org/docs/guide-user/services/nas/samba)服务。

## 安装软件

首先安装软件包，我们选择[samba4]()。
```bash
opkg update 
opkg install luci-app-samba4
```

## 配置

安装完后，去到`/etc/samba`目录，下面有这几个文件：
- secrets.tdb
- smb.conf -> /var/etc/smb.conf
- smb.conf.template
- smbpasswd

我们只需要修改`smb.conf.template`，每次重启samba4服务，都会从模板生成一份配置文件到`/var/etc/smb.conf`，所以不要直接修改后者。

### 去除root用户限制

为了尽可能的简单，我们直接使用root用户登录samba。默认为了安全考虑，是不支持root用户登录samba的。

```conf
	## set invalid users
	# invalid users = root # 把这一句注释掉，不限制root用户登录
```

### 给samba中的root设置密码

samba中的用户密码是独立于系统用户在`/etc/password`中的密码的。我们使用[smbpasswd命令行工具](https://www.samba.org/samba/docs/current/man-html/smbpasswd.8.html)给root用户设置一下密码。

```bash
smbpasswd -a root
```

### 添加共享目录

在luci网页添加共享目录，修改会保存在`/etc/config/samba4`配置文件中。

```conf
config samba
        option workgroup 'WORKGROUP'
        option charset 'UTF-8'
        option description 'Samba on OpenWRT'

config sambashare
        option name 'media'
        option path '/root/media'
        option read_only 'no'
        option guest_ok 'yes'
        option create_mask '0666'
        option dir_mask '0777'
```

或者直接修改模板文件`/etc/samba/smb.conf.template`。

```conf
[media]
        path = /root/media
        create mask = 0666
        directory mask = 0777
        read only = no
        guest ok = yes
        vfs objects = io_uring
```

### 重启服务

最后在luci中保存并应用，或者手动运行命令重启：

```bash
/etc/init.d/samba4 stop
service samba4 start
```

## 备注

### windows出现“不允许一个用户使用一个以上用户名与一个服务器或共享资源的多重连接”

查看连接

```bash
net use
```

释放连接

```bash
net use * /del /y
```
