---
title: 开发钉钉微应用随笔
date: 2022-06-27 10:39:25
tags:
description: 随手记录一下在开发钉钉H5微应用时遇到的一些坑。
---
## 微应用调试工具

类似微信开发者工具中的公众号网页调试，我们在开发时需要一个能看到调试信息的类浏览器环境。

### 钉钉RC版
[钉钉RC版](https://open.dingtalk.com/document/resourcedownload/h5-debug)是钉钉开放平台推出的用于调试钉钉微应用的调试工具，仅支持安卓和win。

与钉钉Desktop版长的基本一样，在微应用界面可以按下`F2`或`F12`打开开发者工具。

### dingtalk-design-cli

[dingtalk-design-cli](https://open.dingtalk.com/document/resourcedownload/local-development-tools-for-microapplications)是钉钉开放平台新推出的H5微应用本地开发工具，开发者通过这个工具可以做到在Web浏览器中调试H5微应用和JSAPI，像开发一个普通H5应用一样开发钉钉H5微应用。

首先安装dingtalk-design-cli
```bash
npm i dingtalk-design-cli -g
```

以开发模式运行网页
```bash
npx react-scripts start
```

在网页目录下新建[`ding.config.json`](https://open.dingtalk.com/document/resourcedownload/configuration-description)
```json
{
  "type": "h5",
  "typescript": true,
  "base": "./",
  "outDir": "./"
}
```

最后以指定targetH5Url模式运行ding
```bash
ding dev web --targetH5Url http://127.0.0.1:3000
```

**注意**
要先将`http://127.0.0.1:3000`填入对应企业的微应用的应用首页地址中。

## 服务端

钉钉官方提供了统一的[SDK]((https://open.dingtalk.com/document/resourcedownload/download-server-sdk)，使用SDK可以便捷地调用[服务端API](https://open.dingtalk.com/document/orgapp-server/api-overview)。

[API Explorer](https://open.dingtalk.com/document/resourcedownload/api-explorer)是一款可视化的[API在线调试工具](https://open-dev.dingtalk.com/apiExplorer)，集成了API总览、快速检索、开发文档、可视化调试、同步动态生成可执行SDK Demo代码，功能丰富、简单易用。可以在API Explorer中查看Demo代码，来了解SDK的用法。
