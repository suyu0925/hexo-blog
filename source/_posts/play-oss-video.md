---
title: 播放在oss上的视频文件
date: 2024-02-23 14:24:44
tags:
description: 放在oss上的视频文件可以直接使用浏览器打开播放，但默认会自动播放，研究一下怎么回事。
---
阿里云oss支持在线播放视频，见文档[上传到OSS的视频如何实现在线播放](https://www.alibabacloud.com/help/zh/oss/how-to-play-videos-online-in-oss)。

## 获取视频url

我们先来看一下怎么获得存放在oss上的视频文件url。

首先我们肯定不能使用公共读文件，安全问题不说，被泄漏网址后流量也糟不住。

需要使用签名参数来限制访问，特别是限制可访问的时间。参见阿里云文档[使用文件URL分享文件](https://www.alibabacloud.com/help/zh/oss/user-guide/how-to-obtain-the-url-of-a-single-object-or-the-urls-of-multiple-objects)。

一个url样例：
```url
https://demo.oss-cn-hangzhou.aliyuncs.com/
  0c2ae6af-4216-4bc0-9a30-c62ec29c4986.mp4
  ?OSSAccessKeyId=LTAI5tPqGXzUJadicEQ1dDm9
  &Expires=1708669567
  &Signature=YQTkN4CqUlHZ5v6ugcPLLCVCVwU%3D
```

## 浏览器打开在线视频的默认行为

使用浏览器打开这个url，浏览器会自动播放视频。此时使用浏览器的开发者工具检查页面，可以看到页面元素如下：
```html
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
  </head>
  <body>
    <video controls autoplay name="media">
      <source
        src="https://demo.oss-cn-hangzhou.aliyuncs.com/0c2ae6af-4216-4bc0-9a30-c62ec29c4986.mp4?OSSAccessKeyId=LTAI5tPqGXzUJadicEQ1dDm9&Expires=1708669567&Signature=YQTkN4CqUlHZ5v6ugcPLLCVCVwU%3D"
        type="video/mp4"
      />
    </video>
  </body>
</html>
```

相当于浏览器自动添加了一个video标签，其中autoplay属性是自动播放的关键。

理论上我们可以在url后面添加参数来控制，比如`&autoplay=false`参数来禁用自动播放，但阿里云并不支持。

## 关闭自动播放

一种更灵活的方式是我们不直接打开视频url，而是在自定义的html中使用video标签来控制。

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #000;
      }
      video {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <video controls autoplay="false" name="media">
      <source
        src="https://demo.oss-cn-hangzhou.aliyuncs.com/0c2ae6af-4216-4bc0-9a30-c62ec29c4986.mp4?OSSAccessKeyId=LTAI5tPqGXzUJadicEQ1dDm9&Expires=1708669567&Signature=YQTkN4CqUlHZ5v6ugcPLLCVCVwU%3D"
        type="video/mp4"
      />
    </video>
  </body>
</html>
```
