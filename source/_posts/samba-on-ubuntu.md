---
title: 在Ubuntu上安装samba
date: 2023-02-03 00:16:14
tags:
description: samba在Ubuntu上算是装机必备了。
---
Ubuntu官方有[samba的安装与配置文档](https://ubuntu.com/tutorials/install-and-configure-samba)。

## 安装samba
```bash
sudo apt update
sudo apt install -y samba
```

## 配置共享目录
创建sambashare目录以便共享
```bash
mkdir /home/<username>/sambashare/
```
注意把`<username>`换成你的用户名。

修改配置
```bash
sudo nano /etc/samba/smb.conf
```
在配置文件最下面添加
```ini
[sambashare]
    comment = Samba on Ubuntu
    path = /home/<username>/sambashare
    read only = no
    browsable = yes
```

重启服务以生效
```bash
sudo service smbd restart
```

配置防火墙放行
```bash
sudo ufw allow samba
```

## 创建账号

samba默认并不会把当前账号添加进去，需要手动添加：
```bash
sudo smbpasswd -a username
```

## windows客户端

如果使用的windows是家庭版，那么还需要加多一步：在`启用或关闭 Windows 功能`中，启用`SMB 1.0/CIFS 文件共享支持`下的`SMB 1.0/CIFS 客户端`。否则会无法访问samba。

有条件还是使用专业版吧，家庭版真是各种坑。
