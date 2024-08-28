---
title: 云上量化交易平台对比
date: 2024-08-20 10:59:05
tags:
- quant
description: 对比一下现在流行的云上量化交易平台。
hidden: true
---
本地自建像[vnpy](https://www.vnpy.com/)、[wtpy](https://github.com/wondertrader/wtpy)，不在本文讨论范围。

相比本地自建，云上量化交易平台的好处是无需浪费过多精力在基础建设，甚至都不需要懂python，注册完直接咔咔开整。

易用性可以简单的用编程语言来描述，语言越低级易用性越低：

- python：[真格](https://quant.pobo.net.cn/)、[金字塔](https://www.weistock.com/)、[迅投](https://www.thinktrader.net/)、[无限易](https://infinitrader.quantdo.com.cn/)、[天勤](https://www.shinnytech.com/tianqin/)
- 简语言：[交易开拓者TB](http://www.tradeblazer.net/)
- 麦语言：[文华8](https://wt8.wenhua.com.cn/)

无限易是金融软件公司[量投科技](https://www.quantdo.com.cn/)的产品，还有[QuantFair](https://quantfair.quantdo.com.cn/)模拟交易平台。

## 回测

[~~米筐~~](https://www.ricequant.com/)
米筐基本只针对股票市场，支持股票、可转债和股权的回测，不支持期货。

[天勤](https://doc.shinnytech.com/tqsdk/latest/usage/backtest.html)
天勤比较特殊，它虽然使用python sdk的形式，但策略是在远程服务器运行。
免费版每天有3次回测机会，专业版无限制。
