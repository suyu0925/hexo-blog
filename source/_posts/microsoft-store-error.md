---
title: 微软应用商店无法连接
date: 2021-07-30 15:30:13
tags:
description: 微软应用商店总是无法连接，试过很多方法，总结一下。
---
因为[GFW](https://zh.wikipedia.org/zh-cn/%E9%98%B2%E7%81%AB%E9%95%BF%E5%9F%8E)，一般来说首先怀疑的是网络连接。

**\* 关闭代理**

Microsoft Store似乎无法工作在代理下，第一个要尝试的就是关掉代理重试。

只是简单的关掉代理有时并不能有效的解决问题，可以去windows的设置中取消代理设置：
* 打开`Internet Explorer`，就是老的自带浏览器，非Edge
* 点击`工具(Tool)`菜单
* 打开`Internet选项`设置
* 选择`连接(Connection)`标签页
* 进入`局域网设置(LAN Settings)`
* 把3个单选框都取消。

如果使用的是clash for windows客户端，在**系统代理（system proxy）**时会修改此处的`使用自动配置脚本`配置，将自动配置脚本的地址设置为`http://127.0.0.1:59742/pac?t=1636534581626`。
其中的内容是：
```javascript
function FindProxyForURL(url, host) {
  return "PROXY 127.0.0.1:7890; SOCKS5 127.0.0.1:7890; DIRECT;"
}
```
取消clash for windows的**系统代理（system proxy）**也会取消`使用自动配置脚本`配置项的选中。

**DNS** 

尝试修改DNS为`4.2.2.1`或`4.2.2.2`，不使用宽带运营商的。

如果确保网络没问题，那大概率是应用商店设置的问题。

**清理应用商店的缓存**

运行WSReset，清除缓存
```bash
WSReset.exe
```

**重置应用商店**

打开 设置>应用>应用和功能>在左边的列表中找到应用商店选中>高级选项>重置。
