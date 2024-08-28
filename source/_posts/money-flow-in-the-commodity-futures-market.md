---
title: 商品期货中的资金流向
date: 2024-08-19 09:44:06
tags:
- quant
description: 研究一下商品期货中的资金流向。
hidden: true
---

## 计算方法

股票和期货市场的资金流向统计方法有所不同。

股市资金流向的计算方法可以参见investopedia的术语解释：[资金流向指数（MFI）](https://www.investopedia.com/terms/m/mfi.asp)。
{% math %}
Money\ Flow\ Index = 100 - \frac{100}{1 + Money\ Flow\ Ratio} \\
Money\ Flow\ Ratio = \frac{14\ Period\ Positive\ Money\ Flow}{14\ Period\ Negative\ Money\ Flow} \\
Raw\ Money\ Flow = Typical Price \times Volume \\
Typical\ Price = \frac{High + Low + Close}{3}
{% endmath %}

期货市场的资金流向可以参见[文华](https://www.wenhua.com.cn/)采用的计算方法，参见[特色抬头解读市场](https://www.wenhua.com.cn/new_guide/Wh6/sj2.html)里的`公式原理`部分。

{% math %}
资金流向 = 今日沉淀资金 - 昨日沉淀资金 \\
沉淀资金 = \left( 持仓量 \times 2 \right) \times 最新价 \times 交易单位 \times 保证金比例 \\
{% endmath %}

## 扩展指标

流入比例

```text
流入比例 = 资金流向 / 沉淀资金
```

### 投机度

活跃的合约往往存在更多交易机会，投资者通常通过成交量的大小来判断合约活跃程度，但成交量大的合约持仓量往往也会很大，很难单纯通过成交量值判断合约活跃性。

```text
投机度 = 成交量 /持仓量
```

## 现有产品

国泰君安的国君投研宝微信小程序，首页的`市场数据`。

[奇货可查](https://x.qhkch.com/)的`资金`。

[交易可查](https://www.jiaoyikecha.com/)的`资金`。

## 数据源

[奇货可查](https://x.qhkch.com/)有资金相关数据，需付费成为企业VIP开通API，可使用[AKShare](https://akshare.akfamily.xyz/tutorial.html)调用。
