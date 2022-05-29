---
title: 腾讯云对象存储概览
date: 2022-05-29 20:52:01
description: 腾讯云认证培训的学习资料
tags: 以Web端直传实践为例，快速概览腾讯云对象存储。
---
对象存储的主要使用场景是不适合放到数据库里的数据，比如底层日志、图片、音频、视频等。

使用对象存储既简便安全，又可以节省业务带宽，又可以配合cdn加速，价格也不算贵，推荐使用。

本文以Web端直传实践为例，基于[腾讯云COS](https://cloud.tencent.com/act/event/cos-novice)做一个快速概览。

## Web端直传实践

### 业务场景

假设我们有用户上传图片或视频的需求，通常的做法是在后台服务器起一个服务，用来处理用户上传文件的需求，设置跨域访问限制，上传成功后返回一个指向上传资源的网址。

### 不足

这种做法有一个天生不足，如果用户上传的时间点很集中，并且上传的文件比较大，会挤爆业务宽带。

而且上传的文件，如果想要使用cdn还需要额外的操作。

### 使用cos

腾讯有[Web端直传实践](https://cloud.tencent.com/document/product/436/9067)的文档。

前端的简易示例文档在[这里](https://cloud.tencent.com/document/product/436/9067)，使用`cos-js-sdk`的文档在[这里](https://cloud.tencent.com/document/product/436/11459)。

Node.js后端的文档在[这里](https://cloud.tencent.com/document/product/436/8629)，临时密钥服务的文档在[这里](https://github.com/tencentyun/qcloud-cos-sts-sdk)。


cos控制台需要留意的地方有：

- [设置跨域访问](https://cloud.tencent.com/document/product/436/13318)

尽量不要使用`*`，使用业务域名。


前端需要留意的地方有：

- 不要使用国外cdn

在腾讯的文档示例中，`cos-auth.min.js`是使用的cdn网址`https://unpkg.com/cos-js-sdk-v5/demo/common/cos-auth.min.js`，在正式环境中**不要**使用`unpkg.com`，在国内环境经常会无法顺畅访问。


后端需要留意的地方有：

- 权限校验

在前端向后端请求[临时密钥](https://cloud.tencent.com/document/product/436/14048)时，应校验前端权限（比如验证上传的用户身份），否则可能被攻击。
