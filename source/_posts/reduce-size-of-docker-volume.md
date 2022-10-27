---
title: 减少docker卷在windows的占用空间
date: 2022-10-27 16:20:47
tags:
- docker
- windows
description: 自从用了docker，C盘是越来越不够用了。用TreesizeFree看了一下，docker的ext4.vhdx用掉了145G……
---
使用wsl2后端的docker会把volume存放在`$Env:LOCALAPPDATA\Docker\wsl\data\ext4.vhdx`，而vhdx文件占用的文件大小和实际使用的文件大小有差异，我们可以优化它。

```powershell
Optimize-VHD -Path $Env:LOCALAPPDATA\Docker\wsl\data\ext4.vhdx -Mode Full
```

在修改之前，我们需要先停止使用。使用**管理员**权限运行：

```powershell
net stop com.docker.service
taskkill /IM "docker.exe" /F
taskkill /IM "Docker Desktop.exe" /F
wsl --shutdown
```

优化完后，`ext4.vhdx`占用空间降到了80G，终于又可以苟一段时间。
