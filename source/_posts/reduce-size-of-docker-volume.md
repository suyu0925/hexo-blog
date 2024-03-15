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

优化完后，`ext4.vhdx`占用空间降到了138G，优化出了7G，终于又可以苟一段时间。

## wsl2占用的空间

顺便记录一下wsl2下其它linux发行版所占用的空间。

可使用`wsl.exe --list --online`来查看所有支持的linux发行版，然后使用`wsl --install [发行版] [选项...]`来安装。

这是我电脑上的情况：
```powershell
> wsl --list --all
适用于 Linux 的 Windows 子系统分发:
Ubuntu-22.04 (默认)
docker-desktop
docker-desktop-data
Ubuntu
```

安装完后，可以使用`\\wsl$\`这个路径来在文件管理器中访问。打开后可以看到docker和已安装的linux发行版的文件夹。

每个文件夹分别对应linux发行版下的`/`目录，比如`\\wsl$\Ubuntu-22.04\usr\bin`就对应Ubuntu 22.04下的`/usr/bin`。

linux系统本质上是挂载了一块vhdx文件，位置在`$Env:LOCALAPPDATA\Packages\`下。

比如在我电脑上
- Ubuntu对应的vhdx是`$Env:LOCALAPPDATA\Packages\CanonicalGroupLimited.Ubuntu_79rhkp1fndgsc\LocalState\ext4.vhdx`
- Ubuntu-22.04对应的vhdx是`$Env:LOCALAPPDATA\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc\LocalState\ext4.vhdx`
- docker data则是上面提到的`$Env:LOCALAPPDATA\Docker\wsl\data\ext4.vhdx`
