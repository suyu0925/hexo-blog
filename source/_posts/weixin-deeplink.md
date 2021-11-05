---
title: 从常规浏览器跳转至微信内部浏览器
date: 2018-06-05 11:47:24
description: 相信大多数手握WAP量的兄逮都会有这个需求，想将在外部投放的广告转化到公众号吸粉。那么我们来探讨一下可能性。
tags:
- computer science
- weixin
- hack
categories: 
- computer science
- weixin
---

相信大多数手握WAP量的兄逮都会有这个需求，想将在外部投放的广告转化到公众号吸粉。那么我们来探讨一下可能性。

## 原理解析

利用微信开放给一些VIP厂商的跳转接口来实现。

比如京东就是一个大VIP。

### 获取ticket

首先调用京东的请求接口来获取openlink。

http://wq.jd.com/mjgj/link/GetOpenLink?callback=getOpenLink&rurl=http://wq.jd.com/mshop/gethomepage?venderid=123

请求之后的结果类似：

```javascript
try {
  getOpenLink({
    "errcode": 0, 
    "openlink": "weixin://dl/business/?ticket=t56560d3fba95d2601278168445705cb9"
  });
} catch(e) {
}
```

这里面的`weixin://dl/business/?ticket=t56560d3fba95d2601278168445705cb9`就是微信跳转的deeplink了。

### 跳转至微信内部浏览器打开商户域名

可以在js中运行重定向来进行跳转：
```javascript
loaciton.href = "weixin://dl/business/?ticket=t7ac579f071faadbce4c31fca854b3e59";
```

注意：这里的urlencode只支持类似wq.jd.com的域名。wq.jd.com是京东的微信/手Q微店。相信在微信的判断有域名和商户的绑定。

### 跳转至目标域名，完成目标

借助jd.com的域名来做跳转。

比如京东微店的产品详情。

[京东云宙斯的api](https://jos.jd.com/api/detail.htm?id=1744)

[移动端链接转换详细说明](http://mjbbs.jd.com/thread-61877-1-1.html)

[京东微店入口](http://wqs.jd.com/weidian/index.shtml)

## 可借助的域名

<!-- more -->

### 京东商铺资讯模式

未完成，待补充

### 京东达人平台模式

- 首先[申请一个账号](http://dr.jd.com/)，可以是个人地址

- 然后登陆选择“文章”栏目发布

- 获取文章地址教程 

  {% asset_img "jd00.png" "获取文章地址教程" %}

### 微信游戏圈话题模式

- [微信打开游戏圈](https://game.weixin.qq.com/cgi-bin/h5/static/club/html/toggle.html?jsapi=1&appid=wx687f4629ba7c3086&uin=&key=&_a=1#wechat_redirect)

- 选择一个话题打开

- 发表话题，上传二维码

- 右上角的三个圆点，分享好友

- 然后去PC微信客户短打开链接复制即可

### 京东任意图片模式（支持动图）

**在京东图片制作自己的落地页**

1. 打开这个地址`http://mjbbs.jd.com/forum.php?mod=forumdisplay&fid=137`

2. 随便点开一个帖子

  {% asset_img "jd11.png" "京东帖子" %}

3. 点击左上方回复按钮

  {% asset_img "jd22.png" "京东帖子" %}

4. 点击高级模式按钮

  {% asset_img "jd33.png" "京东帖子" %}

5. 按步骤上传图片，并且插入进去，点击回复主题

  {% asset_img "jd44.png" "京东帖子" %}

6. 找到你回复的内容，右键提取图片链接

  {% asset_img "jd55.png" "京东帖子" %}

7. 你已经得到一个京东达人的图片链接了

  [例子](http://mjbbs.jd.com/data/attachment/forum/201806/11/170212ym070jwqphzawbrd.jpg)

## 一个例子

[微信跳转技术](http://www.seoniao.com/)这个网站在提供这项服务。

[跳转链接示例](weixin://dl/business/?ticket=t259174b0bd1abfc5e0c16a6515f7a9af#wechat_redirect)

我们来拆解下它的演示样例。

### 获取ticket

首先它提供了一个[演示入口](http://hadaku.cn/jumpfinal/to2.php?token=wtPZxdAM2Z)，它会在服务器端获取一个ticket，然后在前端进行跳转。

```javascript
if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  if (/ baiduboxapp/i.test(navigator.userAgent)) {
    window.location.replace('bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://dl/business/?ticket=t15bc3836874e3b1e3597f67e143ac610%23Intent%3Bend%22%7D');
  } else {
    window.location.replace('weixin://dl/business/?ticket=t15bc3836874e3b1e3597f67e143ac610');
  }
} else {
  window.location.replace('weixin://dl/business/?ticket=t15bc3836874e3b1e3597f67e143ac610');
}

setTimeout(function() {
  document.getElementById("loading").style.display="none";
  document.getElementById("buttons").style.display="table-cell";
}, 3000); 
```

### 跳转至微信内部浏览器并打开合作商户网址

截此到本文录入(2018-06-05 15:02)时，[微信跳转技术](http://www.seoniao.com/)这个网站的功能已经被关闭了。

前天还是可用的呢。暂地告一段落。

找到了[另一个可用的站点](http://weixin.ioptis.cn/)
