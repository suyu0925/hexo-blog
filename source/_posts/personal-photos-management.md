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

## Photoprism
[Photoprism](https://photoprism.org/)是一个开源的照片管理系统，使用Go开发，使用Tensorflow实现AI识别。

优点挺多的，开源、免费、功能强大。

同时缺点也很明显。
- 浏览端[只有PWA](https://docs.photoprism.app/user-guide/pwa/)，没有APP，体验不够好
- 没有同步app。推荐的第三方同步app [PhotoSync](https://www.photosync-app.com/home)收费不说，还不提供一次性购买，只能包年。

## MT Photos
[MT Photos](https://mtmt.tech/)是Photoprism的替代，它有手机用的同步APP，也有手机用的浏览APP，体验比Photoprism好很多。

它是[收费的](https://auth.mtmt.tech/buy)，一次购买99，包年25。

## Synology Photos
[Synology Photos](https://www.synology.com/zh-tw/dsm/feature/photos)是群晖系统使用的NAS照片管理工具。

据说使用体验很接近Google Photos。

但因为是群晖系统，所以需要购买群晖的NAS设备才能使用。

## 参考文章

[终于实现了照片备份到 NAS 的终极方案](https://www.v2ex.com/t/971308)
