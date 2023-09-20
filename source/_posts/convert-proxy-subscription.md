---
title: 代理的订阅格式转换
date: 2023-09-20 14:55:24
tags:
description: 机场提供的订阅会有各种协议，比如v2ray、ssr、trojan，有时不经转换无法使用。本文详细介绍一下。
---
在[OpenClash](https://github.com/vernesong/OpenClash)中，内置了一些提供订阅转换的公开服务：
{% asset_img "converter-in-openclash.png" "OpenClash中的订阅转换服务" %}

但正如OpenClash中提醒的，使用这些公开服务，会存在隐私泄露风险，你的私人订阅链接会暴露给这些服务。

另一方面，即使这些公开服务提供商值得信任，也有可能会因为负载或网络原因出现转换失败。

所以最好的方法，还得是自己建一个。

目前使用最多的开源订阅转换工具毫无疑问是使用C++编写的猛男[subconverter](https://github.com/tindy2013/subconverter/)。如果只使用clash，也可以考虑Go编写的[subscribe2clash](https://github.com/icpd/subscribe2clash)，但我觉得用subconverter就够了。

## 安装

subconverter有提供[中文使用说明](https://github.com/tindy2013/subconverter/blob/master/README-cn.md)。

最简单的使用方法是使用[docker](https://github.com/tindy2013/subconverter/blob/master/README-docker.md)：
```bash
docker run -d --name subconverter --restart=always -p 25500:25500 tindy2013/subconverter:latest
```

只需要一行命令，不分系统。

## 使用

如果是在OpenWrt中运行了subconverter，那么在OpenClash中就可以直接用订阅链接：
```url
http://localhost:25500/sub?target=clash&url=%YOUR_SUBSCRIBE_URL%
```

## 配置

参见官方的[配置文件文档](https://github.com/tindy2013/subconverter/blob/master/README-cn.md#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)。

最常见的修改项是ruleset和proxy_group。

### 以ChatGPT举例

比如我们想要实现使用美国节点来访问ChatGPT。可以这样做：

1. 为ChatGPT添加一个ruleset

在`snippets\rulesets.toml`添加：
```ini
[[rulesets]]
group = "ChatGPT"
ruleset = "rules/ChatGPT.list"
```

同时在`rules/`目录添加ChatGPT.list（docker中的工作目录是`/base`）：
```ini
# ChatGPT
# 尽量使用美国节点
DOMAIN-SUFFIX,openai.com
```

2. 创建一个美国节点组

在`snippets\groups.toml`添加：
```ini
[[custom_groups]]
name = "美国最速节点"
type = "url-test"
rule = ["(美国|US)"]
url = "http://www.gstatic.com/generate_204"
interval = 300

[[custom_groups]]
name = "ChatGPT"
type = "select"
rule = [
    "[]美国最速节点",
    ".*"
]
```

重启subconverter后，就可以实现使用美国节点来访问ChatGPT了。
