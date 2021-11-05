---
title: 在开发中使用代理
date: 2020-12-04 09:50:10
tags:
description: 在开发工作中，我们经常需要翻墙，这里记录一下如何在常见的开发软件中设置使用代理。
---
## python

Windows:
```bash
set http_proxy=http://proxy.myproxy.com
set https_proxy=https://proxy.myproxy.com
python main.py
```

Linux/OS X:
```python
export http_proxy=http://proxy.myproxy.com
export https_proxy=https://proxy.myproxy.com
python main.py
```

## git

```bash
git config --global http.proxy http://proxyuser:proxypwd@proxy.server.com:8080
```

如果要取消代理，消除http.proxy配置项就好
```bash
git config --global --unset http.proxy
```

## node

```bash
npm config set proxy http://LanguidSquid:Password1@my.company.com:8080
npm config set https-proxy http://LanguidSquid:Password1@my.company.com:8080
```

取消代理
```bash
npm config delete http-proxy
npm config delete https-proxy
```
