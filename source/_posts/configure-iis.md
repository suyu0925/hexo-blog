---
title: 配置IIS实现反向代理
date: 2022-10-08 02:39:41
tags:
- windows
- iis
description: 在Windows Server上，IIS比nginx性能强很多，试着配置一下吧。
---
## 安装IIS

打开`服务管理器`，点击`添加角色和功能`，选择安装`Web 服务器(IIS)`。

{% asset_img "install-iis.png" "安装IIS" %}

一般来说，直接按默认设置一路下一步就好。

## Web平台安装程序

下一步要安装[Web平台安装程序](https://www.microsoft.com/web/downloads/platform.aspx)，即Web Platform Installer，简写为WebPI。

如果使用ARR离线安装包，这一步可以省去。

## Application Request Routing

通过WebPI安装[Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing)，简写ARR。

如果无法通过WebPI在线安装，也可直接下载[离线安装包](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=ARRv3_0)。

## 设置反向代理

### 开启ARR的代理功能

这一步其实也能省略，如果没有开启ARR的代理功能，在进入`URL重写(rewrite)`的时候会提示要不要打开。

### URL重写

这里简单记录一下反向代理域名到本地端口的设置方式。

1. 添加空白入站规则。

2. 匹配URL

这里的模式一般填`(.*)`就好，所有URL我们都要反向代理。

3. 条件

条件输入为`{HTTP_HOST}`，模式为域名，如`^www\.yourdomain\.com`。

4. 操作

重写到本地端口，如`http://localhost:3000/{R:1}`。

关于后引用比如`{R:1}`和`{C:1}`的使用可查看[微软官方文档](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference#using-back-references-in-rewrite-rules)

5. **勾选**停止处理后续规则

当反向代理匹配成功后，停止继续匹配后续规则，防止出现幺娥子。
