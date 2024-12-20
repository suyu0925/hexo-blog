---
title: openclash兼容向日葵远程控制
date: 2024-12-20 14:14:10
tags:
  - openclash
description:
---

在 win11 更新到 24H2 `26100.2605`之后，{% post_link enable-remote-desktop-in-windows-home-edition 在win10/11家庭版上打开远程桌面连接 %}里提到的 rdpwrap 彻底不能用了，只能切换到向日葵远程控制。

但 openclash 和向日葵似乎有点冲突，会导致无法连接。

openclash上有个[issue](https://github.com/vernesong/OpenClash/issues/3229)讨论了这个问题，最后得出的解决方案是：

1. 自定义规则，将向日葵的域名加入到直连规则中

```ini
  - DOMAIN-SUFFIX,oray.com,DIRECT
  - DOMAIN-SUFFIX,oray.net,DIRECT
  - DOMAIN-KEYWORD,oray,DIRECT
```

2. 【如果使用了Meta内核】Meta嗅探，跳过嗅探向日葵的域名

```ini
skip-domain:
  - '*.rc.sunlogin.net'
  - '+.oray.com'
  - '+.sunlogin.net'
```
