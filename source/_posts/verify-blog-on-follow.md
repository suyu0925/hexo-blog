---
title: 在follow上认证你的博客
date: 2024-12-27 10:12:29
tags:
description: 最近follow开放了注册，顺手认证一下玩玩。
---
第一步先要让博客支持rss。

我使用的博客引擎是[hexo](https://hexo.io/zh-cn/)，官方支持输出atom 1.0和rss 2.0源。

安装[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)插件，然后在`_config.yml`中添加：

```yml
feed:
  enable: true
  type:
    - atom
    - rss2
  path:
    - atom.xml
    - rss2.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
  icon: icon.png
  autodiscovery: true
  template:
```

第二步，在follow上订阅自己的博客，网址是`http://yourdomain.com/atom.xml`或者`http://yourdomain.com/rss2.xml`。

第三步，在follow上认证自己的博客。

认证有三种方法，随便选一种就行。

{% asset_img follow-verify-m1.png 内容 %}

{% asset_img follow-verify-m2.png 描述 %}

{% asset_img follow-verify-m3.png RSS标签 %}

最简单的就是在`_config.yml`中修改`description`字段，认证完再改回来就行。
