---
title: 个人照片管理
date: 2023-09-28 16:15:24
tags:
- 生活
description: 多年积攒下的海量照片和视频，如何管理？
---
## Google Photos
首选肯定是[Google Photos](https://photos.google.com/)，也是我正在使用的方案。

优点就不用提了，你能想到的所有优点它都有。包括：
- 优秀的多端同步
- 优秀的多端浏览
- AI识别分类
- 强大的搜索
- 简单的编辑
- 自动生成的全景、动画、拼贴、影片等

缺点就两个：
- 要翻墙
- 存储空间极其有限，免费容量只有15G。[付费后也只支持100G](https://support.google.com/drive/answer/2375123)。

翻墙相对容易解决，100G的存储上限就比较无解了。当前只有一个办法：[使用Pixel手机同步](https://support.google.com/photos/answer/6220791?co=GENIE.Platform%3DAndroid&oco=1)。

现在很多人的方案都是这个，买一个Pixel手机，使用[syncthing](https://syncthing.net/)从服务器上同步照片到手机，再使用Google Photos同步到谷歌服务器。

> 2023-10-25 补充：
>
> 在试过了自建方案后，还是买了一个Google Pixel 1代手机，尝试Google相册的{% post_link unlimited-google-photos-storage Google相册无限存储空间 %}方案。

**导出**

Google Photos支持[导出](https://takeout.google.com/settings/takeout/custom/photos)，可以选择导出方式，包括：
- 通过电子邮件发送下载链接
- 添加到云端硬盘
- 添加到Dropbox
- 添加到OneDrive
- 添加至Box

一般就选下载链接吧，其它的选择泄漏风险更大一些。注意不要选50G的分卷，毕竟下载是要翻墙的，网络可能没那么稳定，4G或10G就差不多了。

选择导出到下载链接的话，谷歌照片需要先将照片打包，这个过程不是实时的，需要在后台完成。根据数据量不同可能从几小时到几天，等邮件通知就好。按照经验，300G的照片需要打包半天。

## Synology Photos
[Synology Photos](https://www.synology.com/zh-tw/dsm/feature/photos)是群晖系统使用的NAS照片管理工具。

据说使用体验很接近Google Photos。

但因为是群晖系统，所以需要购买群晖的NAS设备才能使用。

## 免费开源的自建服务

现在市面上也有很多免费开源的自建服务可供选择，[这里](https://github.com/meichthys/foss_photo_libraries)有比较常见的，更全面的自建服务看[这里](https://github.com/awesome-selfhosted/awesome-selfhosted#photo-and-video-galleries)。

### Photoprism
[Photoprism](https://photoprism.org/)是一个开源的照片管理系统，使用Go开发，使用Tensorflow实现AI识别。

优点挺多的，开源、免费、功能强大。

同时缺点也很明显。
- 浏览端[只有PWA](https://docs.photoprism.app/user-guide/pwa/)，没有APP，体验不够好
- 没有同步app。推荐的第三方同步app [PhotoSync](https://www.photosync-app.com/home)收费不说，还不提供一次性购买，只能包年。

### Immich
[Immich](https://immich.app/)有同步APP，强大的AI识别，但是个新项目，还处在[活跃开发阶段](https://immich.app/blog)。[当前版本](https://immich.app/milestones)是v1.82.0，功能已经基本成形，但还存在一些严重影响使用的问题：
- 在iOS App中备份多个文件时，会在最后一个文件卡住[无法备份](https://github.com/immich-app/immich/issues?q=is%3Aissue+is%3Aopen++in%3Atitle%3A+ios%2Bbackup+)
- [AI模型无法自动下载](https://github.com/immich-app/immich/issues/4117#issuecomment-1772790612)
- 只能使用英文搜索
- 无法搜索自定义的描述信息/标签

### LibrePhotos
[LibrePhotos](https://github.com/LibrePhotos/librephotos)在配置上比较麻烦，UI也比较“技术”，总的来说更适合程序员。

### NextCloud Memories
[NextCloud Memories](https://github.com/pulsejet/memories)是[NextCloud](https://nextcloud.com/)的一个插件，相比[NextCloud Photos](https://github.com/nextcloud/photos/)，功能更全面，设计更现代。但NextCloud实在是太厚了，提不起兴趣来。

### MT Photos
[MT Photos](https://mtmt.tech/)是Photoprism的替代，它有手机用的同步APP，也有手机用的浏览APP，体验比Photoprism好很多。

它是[收费的](https://auth.mtmt.tech/buy)，一次购买99，包年25。

## 参考文章

[终于实现了照片备份到 NAS 的终极方案](https://www.v2ex.com/t/971308)
