---
title: Windows Server云服务器装机必备
date: 2022-09-30 10:33:19
tags:
description: 最近想升级一下Windows Server版本，记录一下装机必备。
---
# 以往可以通过Microsoft Store安装的App
首先一个很大的区别是[Server没有Microsoft Store](https://learn.microsoft.com/en-us/windows/msix/msix-server-2019#considerations)，所以很多App只能通过命令行的形式来安装。

比如巨好用的[Windows Terminal](https://github.com/microsoft/terminal)，以及很顺手的包管理器[winget](https://github.com/microsoft/winget-cli)，甚至是[Ubuntu 22.04.1 LTS](https://www.microsoft.com/store/apps/9PN20MSR04DW)。

# 无脑攻略

## VC++ v14 Desktop Framework Package

很多App都依赖[VC++ v14 Desktop Framework Package](https://docs.microsoft.com/troubleshoot/cpp/c-runtime-packages-desktop-bridge#how-to-install-and-update-desktop-framework-packages)，比如`Windows Terminal`和`winget`，所以第一步先安装它。

下载[Microsoft.VCLibs.x64.14.00.Desktop.appx](https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx)，然后使用命令行安装：

```powershell
Add-AppxPackage Microsoft.VCLibs.x64.14.00.Desktop.appx
```

## Dotnet

[Dotnet运行时](https://dotnet.microsoft.com/en-us/download/dotnet/6.0/runtime)也算是装机必备了，一次到位我们直接安装[SDK](https://dotnet.microsoft.com/en-us/download)。目前的LTS版本是6.0，截止写这篇博客时的最新版是[6.0.401](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.401-windows-x64-installer)。

## Visual Studio和Visual Studio Code

[VS](https://visualstudio.microsoft.com/vs/)和[VS Code](https://code.visualstudio.com/)就不用多说了。

## Microsoft.UI.Xaml

[Microsoft.UI.Xaml](https://github.com/microsoft/microsoft-ui-xaml)是一个UI库，被很多App使用（比如winget）。

Microsoft.UI.Xaml是一个面向开发者的库，它并没有直接提供可安装的msixbundle，所以安装方式有一点不一样。

首先去[nuget](https://www.nuget.org/packages/Microsoft.UI.Xaml)下载最新的稳定版[nupkg文件](https://www.nuget.org/api/v2/package/Microsoft.UI.Xaml/2.7.3)，然后解压，再安装包里的bundle。

```powershell
Rename-Item -Path "microsoft.ui.xaml.2.7.3.nupkg" -NewName "microsoft.ui.xaml.2.7.3.zip"
Expand-Archive "microsoft.ui.xaml.2.7.3.zip" -DestinationPath "./microsoft.ui.xaml"
Add-AppxPackage "microsoft.ui.xaml\tools\AppX\x64\Release\Microsoft.UI.Xaml.2.7.appx"
```

## *winget，不支持Windows Server

{% spoiler winget %}

去[发布页](https://github.com/microsoft/winget-cli/releases)下载`Microsoft.DesktopAppInstaller_<versionNumber>.msixbundle`，然后使用命令行安装：

```powershell
Add-AppxPackage Microsoft.DesktopAppInstaller_<versionNumber>.msixbundle
```

**注意**

原来winget不支持Windows Server，请参见[issue中的讨论](https://github.com/microsoft/winget-cli/issues/702#issuecomment-764997870)。

### 依赖

- [VC++ v14 Desktop Framework Package](#VC-v14-Desktop-Framework-Package)。

- [Microsoft.UI.Xaml](#Microsoft-UI-Xaml)

{% endspoiler %}

## Windows Terminal

截止本文更新时间，最新版本是[Windows Terminal v1.15.252](https://github.com/microsoft/terminal/releases/tag/v1.15.2524.0)。

Windows Terminal从第一个版本开始，最低支持Windows内部版本18362.0。在阿里云的Windows Server上只支持2022，其它版本都嫌弃版本低（阿里云的2019内部版本是17763.3287）。

以往我们可以[在微软商店里](https://aka.ms/terminal)安装[Windows Terminal](https://github.com/microsoft/terminal)，现在只能去github项目的[release页面](https://github.com/microsoft/terminal/releases)下载msixbundle文件。

然后手动运行命令安装：

```powershell
# NOTE: If you are using PowerShell 7+, please run
# Import-Module Appx -UseWindowsPowerShell
# before using Add-AppxPackage.

Add-AppxPackage Microsoft.WindowsTerminal_<versionNumber>.msixbundle
```

### 依赖

- [VC++ v14 Desktop Framework Package](#VC-v14-Desktop-Framework-Package)。

## z-jump

z-dump的安装方法参照{% post_link z-jump-around 另一篇博文 %}，Windows Server没有区别。

## *wsl，云服务器不支持二次虚拟化

{% spoiler wsl %}

在Windows Server上，只需要很简单的`wsl --install`就可以[全部配置好](https://learn.microsoft.com/en-us/windows/wsl/install-on-server)，也可以[一步步的手动操作](https://learn.microsoft.com/en-us/windows/wsl/install-manual)。

在服务器上下载Ubuntu LTS实在是太慢了，所以推荐[在本地下载好](https://learn.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions)，再拷贝到服务器上去离线安装。其它服务器在海外的安装包也都可以这么操作。

1. 开启Linux子系统
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

2. 从本地拷贝Linux发行版到服务器上，再运行
```powershell
Rename-Item .\Ubuntu2204-220620.AppxBundle .\Ubuntu2204-220620.zip
Expand-Archive .\Ubuntu2204-220620.zip .\Ubuntu2204-220620
Add-AppxPackage .\Ubuntu2204-220620\Ubuntu_2204.0.10.0_x64.appx
```

然后发现安装失败…… 云服务器本来建议在虚拟化之上，所以[没办法再虚拟一个Linux](https://help.aliyun.com/document_detail/25412.html#section-nxc-2zs-2gb)了。真难受。

{% endspoiler %}

## docker

docker在云服务器上只能使用windows container，使用场景大幅受限，几近鸡肋。

### *Docker Desktop，不支持Windows Server

**注意**，[Docker Desktop](https://www.docker.com/products/docker-desktop/)在Windows Server上运行不起来，因为默认会使用Hyper-V，只建议在Windows 10/11上使用而不是Server。

在Server上我们有Server的打开方式。

### 打开container功能

首先要打开container功能，开启后需要重启才会生效。

```powershell
Install-WindowsFeature -Name Containers
Restart-Computer -Force
```

不同版本的Windows Server对Windows Container的适配性可以在[这里](https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2022%2Cwindows-11#windows-server-host-os-compatibility)查看，简单来说，在阿里云上最佳系统是Windows Server2019。

因为阿里云没有Hyper-V，在没有Hyper-V的情况下，宿主只适配本版本的容器。而当前docker hub上镜像文件比较充足的是2019。

### 安装docker

如果是全新的环境，需要先导入NuGet
```powershell
Install-PackageProvider -Name NuGet -Force
```
然后添加DockerMsftProvider
```powershell
Install-Module -Name DockerMsftProvider -Repository PSGallery -Force
```
最后安装docker
```powershell
Install-Package -Name docker -ProviderName DockerMsftProvider -Force
```

这一步会比较慢，主要是因为服务器在海外，需要多给点耐心，也许要重试几次。

### 启动docker服务

如果`Docker Engine`服务没有自动启动，手动启动它。

```powershell
Start-Service docker
```

### 验证docker

```powershell
PS C:\Users\Administrator> docker run --rm hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
09629875cd6e: Pull complete
7838a6eb98a6: Pull complete
1c2e00cf48a3: Pull complete
Digest: sha256:62af9efd515a25f84961b70f973a798d2eca956b1b2b026d0a4a63a3b0b6a3f2
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (windows-amd64, nanoserver-ltsc2022)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run a Windows Server container with:
 PS C:\> docker run -it mcr.microsoft.com/windows/servercore:ltsc2022 powershell

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```
