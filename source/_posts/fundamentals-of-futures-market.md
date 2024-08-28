---
title: 期货市场的基础知识
date: 2024-08-16 09:19:33
tags:
- quant
description: cheatsheet。
---
## 期货交易所

期货交易所由[证监会](http://www.csrc.gov.cn/)批准成立，交易所变动会在[证监会要闻](http://www.csrc.gov.cn/guestweb4/s?searchWord=%25E6%259C%259F%25E8%25B4%25A7%25E4%25BA%25A4%25E6%2598%2593%25E6%2589%2580&column=%25E6%2596%25B0%25E9%2597%25BB%25E5%258F%2591%25E5%25B8%2583&pageSize=10&pageNum=0&siteCode=bm56000001&sonSiteCode=&checkHandle=1&searchSource=0&govWorkBean=%257B%257D&sonSiteCode=&areaSearchFlag=-1&secondSearchWords=&topical=&docName=&label=&countKey=0&uc=0&left_right_index=0&searchBoxSettingsIndex=&manualWord=%25E6%259C%259F%25E8%25B4%25A7%25E4%25BA%25A4%25E6%2598%2593%25E6%2589%2580&orderBy=0&startTime=&endTime=&timeStamp=0&strFileType=&wordPlace=0)上公示。

截止发帖时间，中国的期货交易所一共有6个。

- [上海期货交易所 (SHFE)](https://www.shfe.com.cn/)，简称上期所。
  - 由上海金属交易所、上海粮油商品交易所和上海商品交易所合并组建，品种比较多元。
  - 重要品种：[金](https://www.shfe.com.cn/products/futures/metal/ferrousandpreciousmetal/au_f/)[银](https://www.shfe.com.cn/products/futures/metal/ferrousandpreciousmetal/ag_f/)[铜](https://www.shfe.com.cn/products/futures/metal/nonferrousmetal/cu_f/)[铝](https://www.shfe.com.cn/products/futures/metal/nonferrousmetal/al_f/)、[螺纹钢](https://www.shfe.com.cn/products/futures/metal/ferrousandpreciousmetal/rb_f/)、[热轧](https://www.shfe.com.cn/products/futures/metal/ferrousandpreciousmetal/hc_f/)、[燃料油](https://www.shfe.com.cn/products/futures/energyandchemical/fu_f/)等。
- [大连商品交易所（DCE）](http://www.dce.com.cn/)，简称大商所。
  - 东北地区唯一一家期货交易所，品种以农产品和工业品为主。
  - 重要品种：[豆粕](http://www.dce.com.cn/dalianshangpin/sspz/487180/index.html)、[豆油](http://www.dce.com.cn/dalianshangpin/sspz/487207/index.html)、[玉米](http://www.dce.com.cn/dalianshangpin/sspz/ym/index.html)、[PVC](http://www.dce.com.cn/dalianshangpin/sspz/487369/index.html)、[铁矿石](http://www.dce.com.cn/dalianshangpin/sspz/487477/index.html)、[棕榈油](http://www.dce.com.cn/dalianshangpin/sspz/487234/index.html)等。
- [郑州商品交易所（CZCE）](http://www.czce.com.cn/)，简称郑商所。
  - 在郑州粮食批发市场的基础上发展起来，品种以农产品和轻工业为主。
  - 重要品种：[菜籽粕](http://www.czce.com.cn/cn/sspz/czp/H770211index_1.htm)、[纯碱](http://www.czce.com.cn/cn/sspz/cjqh/H770224index_1.htm)、[PTA](http://www.czce.com.cn/cn/sspz/pta/H770205index_1.htm)、[玻璃](http://www.czce.com.cn/cn/sspz/bl/H770209index_1.htm)等。
- [中国金融期货交易所（CFFE）](http://www.cffex.com.cn/)，简称中金所。
  - 由上期所、郑商所、大商所、上交所和深交所共同发起设立，产品有股指和国债。
  - 重要品种：[沪深300](http://www.cffex.com.cn/hs300/)、[中证1000](http://www.cffex.com.cn/zz1000/)、[10年期国债](http://www.cffex.com.cn/10tf/)等。
- [上海国际能源交易中心（INE）](https://www.ine.cn/)，简称上期能源。
  - 由上海期化交易所出资设立，面向全球投资者的国际性交易场所，品种为能源相关。
  - 重要品种：[原油](https://www.ine.cn/products/sc/)、[SCFIS欧线](https://www.ine.cn/products/ec/)、[铜(BC)，又称阴极铜](https://www.ine.cn/products/bc/)等。
- [广州期货交易所（GFE）](http://www.gfex.com.cn/)，简称广期所。
  - 最新成立的交易所，未来规划有碳排放、电力、中证商品指数、稀土、咖啡等品种。
  - 目前仅上市2个品种：[碳酸锂](http://www.gfex.com.cn/gfex/tsl/sspz.shtml)、[工业硅](http://www.gfex.com.cn/gfex/gyeg/sspz.shtml)。

## 历史行情

行情包括日内行情和历史行情，以各交易所公示的日行情为例，日行情包括：

- 商品名+交割月份，也即合约名
- 价格数据
  - 今开盘、最高价、最低价、收盘价
  - 前结算、结算参考价
- 涨跌变化
  - 涨跌1、涨跌2
  - 持仓变化
- 成交
  - 成交量
  - 成交额
- 持仓
  - 持仓量

参考：

- [上期所日周数据](https://www.shfe.com.cn/reports/tradedata/dailyandweeklydata/)
- [大商所日行情](http://www.dce.com.cn/dalianshangpin/xqsj/tjsj26/rtj/rxq/index.html)
- [郑商所每日行情](http://www.czce.com.cn/cn/jysj/mrhq/H770301index_1.htm)
- [中金所日统计](http://www.cffex.com.cn/rtj/)
- [上期能源晶统计数据](https://www.ine.cn/statements/daily/?paramid=kx)
- [广期所日行情](http://www.gfex.com.cn/gfex/rihq/hqsj_tjsj.shtml)

### 单边/双边

注意成交量和持仓量有单边和双边的计算方式，在2020年1月1日之前我国不同的品种可能有不同，在这之后全部统一为了单边。

具体采用的是单边还是双边，在交易所的公示行情中会注明，有些交易所在管理办法等里也会有规定。

比如[大连商品交易所交易管理办法](http://www.dce.com.cn/dalianshangpin/fgfz/6142914/6142922/6146614/index.html)中第三十一条`交易所应当及时发布以下与交易有关的信息`规定：
>（十二）成交量。成交量是指某一合约在当日所有成交合约的单边数量。
>
>（十三）持仓量。持仓量是指期货交易者所持有的未平仓合约的单边数量。

又比如[海期货交易所信息管理办法](https://www.shfe.com.cn/regulation/exchangerules/businessmethods/others/202203/t20220322_798636.html)中的

### 结算价

结算价的计算方式通常为某一时段成交价格按照成交量的加权平均价。

以[中金所公示](http://www.cffex.com.cn/zgjrqhjysjsxz/)的[最新版交易细则](http://www.cffex.com.cn/u/cms/www/202406/14170358v2i8.pdf)为例：

```txt
第四十六条 
期货合约当日结算价是指集中交易中某一合约某一时段成交价格按照成交量的加权平均价。交易所另有规定的除外。

该时段发生熔断、集合竞价指令申报或者暂停交易的，扣除熔断、集合竞价指令申报和暂停交易时间后向前取满相应时段。

合约在该时段无成交的，以前一相应时段成交价格按照成交量的加权平均价作为当日结算价。该相应时段仍无成交的，则再往前推相应时段。以此类推。合约当日最后一笔成交距开盘时间不足相应时段的，则取全天成交量的加权平均价作为当日结算价。

合约当日无成交的，当日结算价计算公式为：当日结算价＝该合约上一交易日结算价＋基准合约当日结算价－基准合约上一交易日结算价，其中，基准合约为当日有成交的离交割月最近的合约。合约为新上市合约的，取其挂盘基准价为上一交易日结算价。基准合约为当日交割合约的，取其交割结算价为基准合约当日结算价。根据本公式计算出的当日结算价超出合约涨跌停板价格的，取涨跌停板价格作为当日结算价。

采用上述方法仍无法确定当日结算价或者计算出的结算价明显不合理的，交易所有权决定当日结算价。
```

顺便一提，这里的`某一时段`在2007-06-27[初次实施的中国金融期货交易所结算细则](http://www.cffex.com.cn/u/cms/www/202003/27161724uh8x.pdf)中，是`一小时`。在第二次修订后将`一小时`改成了`某一时段`。第七次修订时又增加了`集中交易中`。

## 延时行情

即时行情是指在交易时间内，与交易活动同步发布的交易行情信息，仅面向交易所会员（会员包括期货公司、银行、大型企业等，可参考[上期所会员名单](https://www.shfe.com.cn/about/member_shfe/memberlist/)）发布。

而延时行情是指即时行情信息延迟一定时间后（通常在10-20分钟）发布的交易行情信息。之所以要有延时行情，是为了降低数据实时传输带来的成本，非专业交易人员对行情的实时性要求不高。各交易所会通过网站向公众公示，比如[中金所](http://www.cffex.com.cn/yshq/)、[上期所](https://www.shfe.com.cn/reports/marketdata/delayedquotes/)。

但国内互联网发展虽然晚，但却相当迅猛，在数据开放性上反倒走在了世界前列。美国各交易所的即时行情是要收费的，免费的只有延时行情。而国内的期货公司和行情软件公司则会把即时行情免费向公众公开，比如[申银万国的CTP](https://www.sywgqh.com.cn/Pc/Customer_Service/Announcement/83993.html)、[文华的wh6行情交易软件](https://wh6.wenhua.com.cn/)。

## 即时行情

[中华人民共和国期货和衍生品法](https://neris.csrc.gov.cn/falvfagui/rdqsHeader/mainbody?navbarId=3&secFutrsLawId=c9f4df6454d745eeb1d614c0d57bfe60&body=)第八十八条规定了交易所需要向会员开放即时行情：
> 期货交易场所应当实时公布期货交易即时行情，并按交易日制作期货市场行情表，予以公布。

即时行情主要内容包括：合约名称、最新价、涨跌、成交量、持仓量、持仓量变化、申买价、申卖价、申买量、申卖量、结算价、开盘价、收盘价、最高价、最低价、前结算价等。

这其实是一个很标准的综合了交易和委托的TAQ（trade and quote）行情应该包含的内容。

### tick数据

这里要特别说明一下，真正的tick级，指的是即时发送对委托的增、删、改，以及成交这四种行情数据。

而国内期货即时行情并不是真正的tick级，它会以一个固定频率推送下采样（down sampling）后的快照（snapshot），以减少数据量，同时尽可能保留数据中的重要信息。

因为这已经是能拿到的颗粒度最细的数据，所以日常中还是把它叫做tick数据。

- level 1行情免费。推送频率为500ms，也就是1秒2次推送。报单薄（Order Book）只有一档。
- level 2行情收费。推送频率为250ms（中金所和上期所/上期能源仍是500ms），也就是1秒4次推送。同时还有着五档订单委托行情，所以又叫多档行情。

## 盘口

盘口是市场的实时交易情况。这个“盘”就是买盘和卖盘中的盘，其实就是订单或者说报价的集合（Orders），所以盘口翻译成英文直接就是“Order Book”。

盘口中的“中”代表买卖价差（bid-ask spread）。订单薄（Order Book）中最佳卖价（Best Offer/Ask）和最佳买价（Best Bid）之间的区间有时也会被称做盘口。

举例说明：
> 2024-08-16甲醇MA2501在收盘时，最佳卖价为2437，最佳买价为2435，盘口即为2437-2435=2。
>
> 纯碱SA2501在收盘时，最佳卖价为1583，最佳买价为1582，盘口为1583-1582=1。

我们可以使用即时行情来自己维护一个盘口，参见[这篇博客](https://blog.csdn.net/jojojuejue/article/details/134266483)。

### 深度

市场越活跃，则盘口越小，订单薄深度也越深。

在加密货币市场，充斥着大量不真实的市场，需要交易者自行判断。盘口深度就是衡量市场是否成熟的一个很重要的指标，比如看盘口深度是不是在市价（market-price）2%-5%以内。更多的加密货币盘口相关看[这里](https://medium.com/@digitalroadgroup/liquidity-metric-recommendation-95a5b4975dd6)。

### 逐笔明细

#### 现手列颜色

现手列为红色：主动买成交（成交价与卖价相同称为主动买）。

现手列为绿色：主动卖成交（成交价与买价相同称为主动卖）。

#### 开平列名词解释

空开：以买价为成交价并且增仓为正值。

多开：以卖价为成交价并且增仓为正值。

双开：现手与增仓的值相同。

双平：现手与增仓的绝对值相同。

空平：以卖价为成交价并且增仓为负值。

多平：以买价为成交价并且增仓为负值。

多换：增仓为0，并且最新成交价与卖价相同（主动买）。

空换：增仓为0，并且最新成交价与买价相同（主动卖）。

注：灰色价格是场内另创新高新低数据，即交易所撮合成交后未以抽样Tick发布出来的最高价/最低价，只支持国内期货品种显示。
