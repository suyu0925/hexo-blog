---
title: 在windows上打开heic文件
date: 2023-10-30 16:35:07
tags:
description: heic是苹果的默认相机拍摄的照片格式，但在windows上默认不支持。
---
[HEIC](https://www.adobe.com/creativecloud/file-types/image/raster/heic-file.html)是苹果使用的Live Photo照片格式。它代表High Efficiency Image Container，是HEIF（High Efficiency Image Format）的变种。在iOS中可以在相册设置切换拍摄的照片格式为高效（HEIF/HEVC）还是兼容性最佳(JPEG/H.264)。

windows默认不支持这种格式，但可以通过安装解码器来支持。

微软提供了两个解码器：[HEIF Image Extensions](https://apps.microsoft.com/detail/heif-image-extensions/9PMMSR1CGPWG)和[HEVC Video Extensions](https://apps.microsoft.com/detail/hevc-video-extensions/9NMZLZ57R3T7)。

前者免费，后者0.99刀（7元人民币）。

虽然微软为了支持苹果的格式应该付出了一些代价，但就这样直接转嫁给用户有点没道理。好在微软还提供了一个给OEM用的免费版本：[HEVC Video Extensions from Device Manufacturer](https://apps.microsoft.com/detail/9N4WGH0Z6VHQ)，只能在OEM预装的电脑上安装。

这里又体现出了微软的一贯风格：对盗版的宽容态度。

我们可以通过网站[store.rg-adguard.net](https://store.rg-adguard.net/)搜索ProductId：`9N4WGH0Z6VHQ`，得到appxbundle安装文件的[微软官方下载链接](http://tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/c0584440-47bb-46fc-a034-455731dbab23?P1=1698656425&P2=404&P3=2&P4=NzSVaRQdI5l7lNPBqOLLmLUgtvaW%2blginN3OI592QCHnz07q12svW5PXuN%2b%2berfrQmcVySHCdypL2v2Fos9cZg%3d%3d)。

安装解码器后就可以在windows上打开heic文件了。

**re-adguard**
`re-adguard`是个神奇的网站。俄罗斯不愧拥有全球最顶级的黑客社区，盗版这块也是全球第一。

在[tb.rg-adguard.net](https://tb.rg-adguard.net)可以下载windows、office的各个版本安装文件，并得到了[来自微软的合法认证](https://answers.microsoft.com/en-us/windows/forum/all/is-this-site-legal/67add2fb-2cda-4169-a2d2-9612129f3b1d)。同样出自俄罗斯的[rufus](https://rufus.ie/)也可以下载windows的各个版本。毛子好顶赞。

`tb.rg-adguard.net`这个项目已经不再维护，新的文件项目是[files.rg-adguard.net](https://files.rg-adguard.net/category)。
