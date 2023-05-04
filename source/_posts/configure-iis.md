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

## 开启https

### 安装SSL证书

首先需要有SSL证书，推荐的有两种方式：
1. 使用[阿里云免费SSL证书](https://help.aliyun.com/document_detail/156645.htm)
2. 使用[acme.sh](https://github.com/acmesh-official/acme.sh)

其中，acme是linux专供，但它的续期是自动的，不需要每年一次额外的手动更新证书。

如果用在IIS，就只能使用阿里云。安装方法参见阿里云文档[在IIS服务器上安装SSL证书](https://help.aliyun.com/document_detail/98729.html)。

### 导入证书

既可以通过`mmc`Windows服务器控制台（MMC，Microsoft Management Console）导入，也可以通过IIS的`服务器证书`导入。

### 绑定证书

进入绑定界面

{% asset_img "binding.png" "进入绑定界面" %}

添加绑定

{% asset_img "add-binding.png" "添加绑定" %}

完成配置

{% asset_img "commit_binding.png" "完成配置" %}

注意要将类型切换至https，填入正确的域名（免费证书只对应一个单域名），且选中需要服务器名称指示（Server Name Indication）。

如不选中需要服务器名称指示，会使用同一个证书。

### 将http重定向至https

已经有了https，就不需要再保留不安全的http了。

创建一个新的URL重写规则，判断`{HTTPS}`为`^OFF$`，`{HTTP_METHOD}`为`^GET$`，且域名为已开启https的域名，则重定向至`https://{HTTP_POST}/{R:1}`。

重定向类型可以用[302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages)。

**注意**

- 要将此条规则优化级挪至反向代理的规则之上，避免直接走了反向代理的规则执行不到这里。

- 重定向一定要指定仅对get方法生效，避免影响post。

不同的客户端对post返回的状态码处理方法有不同，会生产不同的效果。

比如.Net的HttpClient对307的第二次请求就会去除Authentication信息，而nodejs的axios和postman会带上。

## 客户端IP

在`Application Request Routing Cache`-->`Server Proxy Settings`-->`Preserve Client IP in the following header`设置中，可以指定客户端IP的传递方式。

默认是保存在`X-Forwarded-For`中，如果需要保存在其他的header中，可以在这里修改。或者留空，不保存。

可参阅[Application Request Routing Page文档](http://technet.microsoft.com/en-us/library/dd443533(v=ws.10).aspx)。

## 日志

通常服务器的系统盘容量都不会特别大，如果不做限制，IIS的日志将会成为很大的负担。

### 更改日志文件目录

我们可以从这里进入日志配置。

{% asset_img "logging_configure.jpg" "日志配置" %}

默认日志文件存储在`%SystemDrive%\inetpub\logs\LogFiles`下，我们可以把它更改至有更大剩余容量的硬盘上。

{% asset_img "logging_file_directory.jpg" "日志文件目录" %}

但这样并不能完全解决问题，不论多大的硬盘，以IIS日志每天几百兆的速度还是很快会有满的一天，真正的解决方案还是类似只保留最近30天的日志之类的。

### 使用IIS Log Cleaner工具

最简单的办法是使用微软自家的[IIS Log Cleaner Tool](https://learn.microsoft.com/en-us/iis/manage/provisioning-and-managing-iis/managing-iis-log-file-storage#delete-old-log-files-by-the-iis-log-cleaner-tool)。

参见微软文档，下载后直接运行，第一次运行需要先进行设置，之后就会自动清除了。

需要注意的是，`IISLogCleaner.exe`并不会注册服务，也就是说重启后需要手动再次启动。所以我们需要把它的快捷方式扔进`%appdata%\Microsoft\Windows\Start Menu\Programs\Startup`来完成自启。

### 添加客户端IP到日志

在日志页，我们可以添加客户端IP到日志中。

在日志文件栏的选择字段中，添加Request Header的`X-Forward-For`自定义字段。
