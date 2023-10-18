---
title: "AIO：CPU选择"
date: 2023-10-18 16:36:42
tags:
description: 想组个NAS存照片，先来看一下适合做AIO（All In One）的CPU选择。
---

先看一下目前市面上流行的低功耗CPU对比：

|        | J4125 | N5105 | J6412 | N100 | N305 | 
| ---: | ---: |--- |--- |--- |--- |
| 核心数 | 4CT4T | 4CT4T | 4CT4T | 4CT4T | 8CT8T | 
| 主频/睿频 | 2.0/2.7GHz | 2.0/2.9GHz | 2.0/2.7GHz | 0.8/3.4GHz | 1.8/3.8GHz |
| 制程 | 10nm | 10nm | 10nm | 7nm | 7nm |
| TDP | 10W | 10W | 10W | 6W | 15W |
| 核显 | UHD 600 | 24EU | 16EU | 24EU | 32EU |
| 黑群晖硬解 | ✔️ | ✔️ | ✔️ | ❎ | ❎ |
| 最大支持内存 | 8GB/双 | 32GB/双 | 32GB/双 | 16GB/单 | 16GB/单 |
| CPU-Z单核跑分 | 213 | 255 | 240 | 380 | 418 |
| CPU-Z多核跑分 | 807 | 994 | 950 | 1298 | 2734 |
| 发布时间 | 2019Q4 | 2021Q1 | 2021Q1 | 2023Q1 | 2023Q1 |

目前主流仍是N5015和J6412，但第12代U已经开始逐步发力。比如[畅网微控](https://mall.jd.com/index-10253706.html)就在主推。

## 参考资料

- 什么值得买上[冥冰薇](https://zhiyou.smzdm.com/member/7188731034/)的[玩转NAS](https://post.smzdm.com/xilie/98415/)系列和[AIO从入门到如土](https://post.smzdm.com/xilie/102537/)系列
